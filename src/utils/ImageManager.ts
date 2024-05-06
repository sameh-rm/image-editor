import { IArea } from '@bmunozg/react-image-area';
import {
  bufferToBase64Src,
  downloadImage,
  hexToBytes,
  imageDataToDataURL,
  jsonFromHex,
  stringToHex
} from './editor.utils';
import { toast } from 'react-toastify';

export class ImageMetadataManager {
  private static instance: ImageMetadataManager | undefined;
  private imageData: string | undefined;
  private canvas: HTMLCanvasElement | undefined;

  private constructor() {}

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
    return ImageMetadataManager.getInstance();
  }

  /**
   * Retrieves the payload data from the specified area on the canvas.
   * @param {IArea} area - The area from which to extract the payload data.
   * @returns {string} The payload data as a data URL.
   */
  getAreaPayload(area: IArea) {
    const mainImageCtx = this.canvas?.getContext('2d');
    const imageData = mainImageCtx.getImageData(
      area.x,
      area.y,
      area.width - 1,
      area.height - 1
    );

    return imageDataToDataURL(imageData);
  }

  /**
   * Hides image pixels within a specified area on the canvas by setting RGB values to zero.
   * @param {IArea} area - The area on the canvas where pixels will be hidden.
   */
  hideImagePixel(area: IArea) {
    const ctx = this.canvas?.getContext('2d');
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

      // modify Area pixel colors with the value of 0
      for (let i = 0; i < newData.data.length; i += 4) {
        newData.data[i] = 0; // Red
        newData.data[i + 1] = 0; // Green
        newData.data[i + 2] = 0; // Blue
      }

      // Update canvas with modified pixel data
      ctx.putImageData(newData, area.x, area.y);
    }
  }

  /**
   * Saves the Hidden areas data to the image.
   * @param {string} imageDataUrl - The data URL of the image.
   * @param {string} data - the Hidden areas data to be saved.
   * @returns {string} The data URL of the modified image.
   */
  async saveDataToImage(imageDataUrl, data) {
    const imageBuffer = await (await fetch(imageDataUrl)).arrayBuffer();

    const bytes = new Uint8Array(imageBuffer);
    const hex = [];
    // iterates over each byte in bytes array making sure the byte is positive if not adding 256
    // to make sure byte within range 0 to 255 before converting it to hexadecimal
    // split each byte into two parts each part is 4bits to fit as hexadecimal digit
    for (let i = 0; i < bytes.length; i++) {
      const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xf).toString(16));
    }

    const hexStr = hex.join('') + stringToHex(data);

    const buffer = new Uint8Array(hexToBytes(hexStr));
    const url = bufferToBase64Src(buffer);
    downloadImage(url);
    return url;
  }

  /**
   * Extracts metadata from the image data URL by converting it to hexadecimal and parsing JSON data.
   * @returns {Array} The extracted metadata as an array.
   */
  getMetadata() {
    // Extract the base64 part of the data URL
    const base64Index = this.imageData.indexOf('base64,');
    if (base64Index === -1) {
      console.error('Invalid data URL format');
      return null;
    }
    const base64Data = this.imageData.substring(base64Index + 'base64,'.length);

    // Decode the base64 data to a binary string
    const binaryString = atob(base64Data);

    // Convert the binary string to a hexadecimal string
    let hexStr = '';
    for (let i = 0; i < binaryString.length; i++) {
      const hex = binaryString.charCodeAt(i).toString(16);
      hexStr += (hex.length === 1 ? '0' : '') + hex;
    }

    // get the last index of ffd9, split the hexStr
    // to get the payload from the last part of the hex
    return jsonFromHex(hexStr.substring(hexStr.lastIndexOf('ffd9') + 4)) || [];
  }

  /**
   * Commits image metadata by hiding pixels based on the metadata area and saving the modified image.
   * @param {MetadataObjectType[]} metadata - An array of metadata objects to be applied to the image.
   * @returns {boolean} Returns true if the operation is successful, false if an error occurs, or undefined if imageData is not initialized.
   */
  commitImageMetadata(metadata: MetadataObjectType[]) {
    if (!this.imageData) {
      console.error('Please init ImageData First!');
      return undefined;
    }
    metadata.forEach((mObj) => {
      this.hideImagePixel(mObj.area);
    });

    const data = this.canvas?.toDataURL('image/jpeg');
    try {
      this.saveDataToImage(data, JSON.stringify(metadata)).then(() => {
        toast('File Downloaded Successfully!', {
          type: 'success'
        });
      });
      return true;
    } catch (error) {
      console.log('error', error);
    }
    return false;
  }
}
