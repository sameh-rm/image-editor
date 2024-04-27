// Function to hide a message in an image
export function hideMessage(imageData: ImageData) {
  for (let i = 0; i < imageData.data.length; i += 4) {
    // Convert char to binary
    // Modify the least significant bits of the image data
    imageData.data[i] = (0 & 0xfe) | imageData.data[i];
    imageData.data[i + 1] = (0 & 0xfe) | imageData.data[i + 1];
    imageData.data[i + 2] = (0 & 0xfe) | imageData.data[i + 2];
    // Skip alpha channel
  }
}

// Function to extract a message from an image
export function extractMessage(imageData: ImageData) {
  let message = "";

  for (let i = 0; i < imageData.data.length; i += 4) {
    // Extract the least significant bits of the image data
    const charCode =
      ((imageData.data[i] & 0x01) << 7) |
      ((imageData.data[i + 1] & 0x01) << 6) |
      ((imageData.data[i + 2] & 0x01) << 5);

    if (charCode !== 0) {
      message += String.fromCharCode(charCode);
    } else {
      break;
    }
  }

  return message;
}
