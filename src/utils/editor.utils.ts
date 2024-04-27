import { IArea } from "@bmunozg/react-image-area";

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

export function imageDataToDataURL(imageData: ImageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  ctx!.putImageData(imageData, 0, 0);
  const payload = canvas.toDataURL("image/jpeg");
  return payload;
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



export function parseExifMetadata(exifMetadata: MetadataType) {
  return Object.keys(exifMetadata)
    .map((key) => {
      try {
        const obj = JSON.parse(exifMetadata[key]);
        if (typeof obj === "object") {
          return obj;
        }
      } catch {}
      return undefined;
    })
    .filter((obj) => obj);
}
