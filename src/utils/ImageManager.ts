import { IArea } from "@bmunozg/react-image-area";
import { STARTING_HEX } from "./constants";
import { downloadImage } from "./editor.utils";
import piexif from "./piexif.js";
import { Buffer } from "buffer";
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

  hideImagePixel(area: IArea) {
    const ctx = this.canvas?.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(
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

      for (let i = 0; i < newData.data.length; i += 4) {
        newData.data[i] = 0; // Red
        newData.data[i + 1] = 0; // Green
        newData.data[i + 2] = 0; // Blue
      }

      // Update canvas with modified pixel data
      ctx.putImageData(newData, area.x, area.y);
    }
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
    areaNumber: number, //areaNumber
    area: IArea,
    payload: string
  ) {
    const id = (STARTING_HEX + areaNumber).toString();
    piexif.ExifIFD[id] = STARTING_HEX + areaNumber;
    piexif.TAGS.Exif[id] = {
      name: "HiddenData",
      type: "Undefined",
    };
    this.metadata[id] = JSON.stringify({
      areaNumber,
      area,
      payload: payload,
    });
  }

  commitImageMetadata(metadata: MetadataObjectType[]) {
    console.log("metadata", metadata);
    metadata.forEach((mObj) => {
      this.insertImageMetadata(mObj.areaNumber, mObj.area, mObj.payload);
    });

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

    if (exifStr.length + 2 <= 0xffff) {
      metadata.forEach((mObj) => {
        console.log("mObj", mObj);
        this.hideImagePixel(mObj.area);
      });
    } else {
      console.error("Too large");
    }
    const data = this.canvas?.toDataURL("image/jpeg");

    console.log("exifObj", this.exifObj);

    try {
      const inserted = piexif.insert(exifStr, data);
      // const newBase64 = btoa(inserted);
      // const imageDataUrl = `data:image/jpeg;base64,${newBase64}`;

      downloadImage(inserted);

      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }
}
