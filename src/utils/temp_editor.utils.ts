import piexif from "piexifjs";
import { Buffer } from "buffer";
import { IArea } from "@bmunozg/react-image-area";
import { STARTING_HEX } from "./constants";
import pako from "pako";
import { MutableRefObject } from "react";
const chunkSize = 0x4444;

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

function isSegmentSizeValid(str: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return bytes.length <= chunkSize;
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

function splitDataURLIntoChunks(dataURL: string) {
  const byteCharacters = atob(dataURL.split(",")[1]);
  const chunks = [];
  for (let i = 0; i < byteCharacters.length; i += chunkSize) {
    chunks.push(byteCharacters.slice(i, i + chunkSize));
  }
  return chunks;
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

  const payload = imageDataToDataURL(imageData);
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
  return payload;
}

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
  [key: string]: MetadataObjectType | string;
};

export function restoreChunksToDataURL(
  key: string,
  metadata: MetadataType,
  visited: Set<string>
) {
  const chunks = Object.entries(metadata)
    .filter(([k, v]) => {
      if (visited.has(key)) return false;

      const dataObject = JSON.parse(v as string) as MetadataObjectType;
      if (!dataObject.isChunck) return false;
      console.log("{first}", {
        "parseInt(k) === parseInt(key)": parseInt(k) === parseInt(key),
        "parseInt(k)": parseInt(k),
        "parseInt(key)": parseInt(key),
        "parseInt(k) <= parseInt(key) + dataObject.chunkIndex":
          parseInt(k) <= parseInt(key) + dataObject.chunkIndex,
        "dataObject.chunkIndex": dataObject.chunkIndex,
      });
      return (
        parseInt(k) === parseInt(key) ||
        parseInt(k) <= parseInt(key) + dataObject.chunkIndex
      );
    })
    .map(([k, v]) => (JSON.parse(v as string) as MetadataObjectType).payload);
  const byteCharacters = chunks.join("");

  return "data:image/jpeg;base64," + btoa(byteCharacters);
}

type ExifObjectType = {
  Exif: {
    [key: string]: any;
  };
};
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
      name: id.toString(),
      type: "Ascii",
    };
    if (isSegmentSizeValid(payload)) {
      this.metadata[id] = JSON.stringify({
        areaIndex,
        area,
        payload: payload,
        chunkIndex: 0,
        isChunck: false,
        areasCount,
      });
    } else {
      const chunks = splitDataURLIntoChunks(payload);
      chunks.forEach((chunk, chunkIndex) => {
        const id = (
          STARTING_HEX +
          areaIndex * areasCount +
          chunkIndex
        ).toString();
        piexif.ExifIFD[id] = STARTING_HEX + areaIndex * areasCount + chunkIndex;
        piexif.TAGS.Exif[id] = {
          name: id.toString(),
          type: "Ascii",
        };
        console.log('id', id)
        this.metadata[id] = JSON.stringify({
          payload: chunk,
          area,
          areaIndex,
          chunkIndex,
          chunkCount: chunks.length,
          isChunck: true,
          areasCount,
        });
      });
    }
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
    console.log('this.exifObj', exifStr)
    const inserted = piexif.insert(exifStr, atob(data!.split(",")[1]));
    const newBase64 = btoa(inserted);
    downloadImage(`data:image/jpeg;base64,${newBase64}`);
  }
}
