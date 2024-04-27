import piexif from "piexifjs";
import { Buffer } from "buffer";
import { IArea } from "@bmunozg/react-image-area";
import { STARTING_HEX } from "./constants";

type MetadataObjectType = {
  areaIndex: number;
  area: IArea;
  payload: string;
  chunkIndex: number;
  isChunck: boolean;
  chuncksCount?: number;
  areasCount?: number;
};

type MetadataType = {
  [key: string]: MetadataObjectType | string | any;
};

type ExifObjectType = {
  Exif: {
    [key: string]: any;
  };
  [key: string]: {
    [key: string]: any;
  };
};

export async function downloadImage(imageData: string) {
  // Save the blob to a file
  const a = document.createElement("a");
  a.href = imageData;
  a.download = "image.jpg";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(imageData);
  document.body.removeChild(a);
}

function imageDataToDataURL(imageData: ImageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  ctx!.putImageData(imageData, 0, 0);
  const payload = canvas.toDataURL("image/jpeg");
  return payload;
}

async function getImageData(base64Image: string) {
  await fetch(base64Image)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a new FileReader
      const reader = new FileReader();
      let imageData = undefined;
      reader.onload = () => {
        const arrayBuffer = reader.result;

        // Convert the ArrayBuffer to Uint8Array
        const uint8Array = new Uint8ClampedArray(arrayBuffer as ArrayBuffer);

        // Create an ImageData object from the Uint8Array
        imageData = new ImageData(uint8Array, 300); // Assuming width of 300 pixels
        // Now, you have the ImageData object
        console.log("ImageData:", imageData);
      };
      reader.readAsArrayBuffer(blob);
      return imageData;
    });
}

export function getAreaPayload(
  area: IArea,
  mainImageCtx: CanvasRenderingContext2D
) {
  const imageData = mainImageCtx.getImageData(
    area.x,
    area.y,
    area.width - 1,
    area.height - 1
  );

  const payload = imageDataToDataURL(imageData);
  return payload;
}

export function hideImagePixel(
  area: IArea,
  mainImageCtx: CanvasRenderingContext2D
) {
  const imageData = mainImageCtx.getImageData(
    area.x,
    area.y,
    area.width - 1,
    area.height - 1
  );

  const newData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  // Modify pixel data (e.g., invert colors)
  for (let i = 0; i < newData.data.length; i += 4) {
    newData.data[i] = 0; // Red
    newData.data[i + 1] = 0; // Green
    newData.data[i + 2] = 0; // Blue
    // Do not modify alpha channel (i + 3)
  }

  // Update canvas with modified pixel data
  mainImageCtx.putImageData(newData, area.x, area.y);
}

export class ImageMetadataManager {
  private static instance: ImageMetadataManager | undefined;
  private imageData: string | undefined;
  private exifObj: ExifObjectType;
  private metadata: MetadataType;
  private canvas: HTMLCanvasElement | undefined;
  private constructor() {
    this.metadata = {};
    this.exifObj = { Exif: {} };
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ImageMetadataManager();
    }
    return this.instance;
  }

  initImageData(canvas: HTMLCanvasElement, imageData: string) {
    this.canvas = canvas;
    this.imageData = imageData;
    return ImageMetadataManager.getInstance();
  }

  initExifObject() {
    this.exifObj = this.getImageMetadata();
    return ImageMetadataManager.getInstance();
  }

  getImageMetadata(data?: string): ExifObjectType {
    if (!this.imageData) {
      console.error("Please init ImageData First!");
      return { Exif: {} };
    }

    const buffer = Buffer.from(data || this.imageData);
    let exif: ExifObjectType = {
      Exif: {},
    };
    try {
      exif = piexif.load(buffer.toString("binary"));
    } catch (error) {
      console.log("exif Error", error);
    }
    return exif;
  }

  insertImageMetadata(
    areaIndex: number, //areaIndex
    area: IArea,
    payload: string,
    areasCount: number
  ) {
    const id = (STARTING_HEX + areaIndex).toString();
    piexif.ExifIFD[id] = STARTING_HEX + areaIndex;
    piexif.TAGS.Exif[id] = {
      name: "HiddenData",
      type: "Undefined",
    };
    // if (isSegmentSizeValid(payload)) {
    this.metadata[id] = JSON.stringify({
      areaIndex,
      area,
      payload: payload,
      areasCount,
    });

    // } else {
    //   const chunks = splitDataURLIntoChunks(payload);
    //   chunks.forEach((chunk, chunkIndex) => {
    //     const id = (
    //       STARTING_HEX +
    //       areaIndex * areasCount +
    //       chunkIndex
    //     ).toString();
    //     piexif.ExifIFD[id] = STARTING_HEX + areaIndex * areasCount + chunkIndex;
    //     piexif.TAGS.Exif[id] = {
    //       name: id.toString(),
    //       type: "Ascii",
    //     };
    //     this.metadata[id] = JSON.stringify({
    //       payload: chunk,
    //       area,
    //       areaIndex,
    //       chunkIndex,
    //       chunkCount: chunks.length,
    //       isChunck: true,
    //       areasCount,
    //     });
    //   });
    // }
  }

  commitImageMetadata() {
    if (!this.imageData) {
      console.error("Please init ImageData First!");
      return undefined;
    }
    console.log("this.metadata ", this.metadata);
    this.exifObj = {
      ...this.exifObj,
      Exif: { ...this.exifObj?.Exif, ...this.metadata },
    };
    const exifStr = piexif.dump(this.exifObj);
    const data = this.canvas?.toDataURL("image/jpeg");
    console.log("this.exifObj", exifStr);
    try {
      const inserted = piexif.insert(exifStr, atob(data!.split(",")[1]));
      const newBase64 = btoa(inserted);
      downloadImage(`data:image/jpeg;base64,${newBase64}`);
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }
}
