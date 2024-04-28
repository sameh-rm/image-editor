export async function downloadImage(imageData: string) {
  // Save the blob to a file
  const a = document.createElement('a');
  a.href = imageData;
  a.download = 'image.jpg';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(imageData);
  document.body.removeChild(a);
}

export function imageDataToDataURL(imageData: ImageData) {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx!.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg');
}

export function parseExifMetadata(exifMetadata: MetadataType) {
  return Object.keys(exifMetadata)
    .map((key) => {
      try {
        const obj = JSON.parse(exifMetadata[key]);
        if (typeof obj === 'object') {
          return obj;
        }
      } catch {}
      return undefined;
    })
    .filter((obj) => obj);
}

export function stringToHex(str) {
  let hex = '';

  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }

  return hex;
}

export function jsonFromHex(hex) {
  try {
    return JSON.parse(stringFromHex(hex));
  } catch (error) {
    console.error('jsonFromHex', error);
  }
  return [];
}
export function stringFromHex(hex) {
  let str = '';

  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return str;
}

export function hexToBytes(hex) {
  const bytes = [];

  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }

  return new Uint8Array(bytes);
}

export function bufferToBase64Src(buffer) {
  const imageBuffer = new Uint8Array(buffer);

  const b64encoded = btoa(
    imageBuffer.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  return `data:image/jpeg;base64,${b64encoded}`;
}
