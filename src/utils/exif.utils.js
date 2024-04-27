// import piexif from "piexifjs";
// const sharp = require("sharp");

// // Path to your image file
// const imagePath = "./pexels-phuc-lai-1112451390-20788970.jpg";

// // Define EXIF data
// let exif = {};
// piexif.ExifIFD.CustomAreaData = 0xa013;
// piexif.TAGS.Exif[piexif.ExifIFD.CustomAreaData] = {
//   name: "CustomAreaData",
//   type: "Ascii",
// };

// const startX = 100;
// const startY = 100;
// const width = 200;
// const height = 200;

// // Read the image and extract the area as a buffer
// await sharp(imagePath)
// .extract({ left: startX, top: startY, width: width, height: height })
// .toBuffer()
// .then((buffer) => {
//   exif[piexif.ExifIFD.CustomAreaData] = buffer.toString("base64");
// });

// sharp(imagePath)
//   .extract({ left: startX, top: startY, width: width, height: height })
//   .toBuffer()
//   .then(async (buffer) => {
//     // Use the extracted area buffer as needed
//     try {
//       exif = piexif.load(buffer.toString("binary")).Exif;
//     } catch (error) {
//       console.log("exif Error", error);
//     }

//     const exifObj = { Exif: exif };
//     console.log("first", Object.keys(exif));
//     const exifStr = piexif.dump(exifObj);
//     // Insert EXIF data into the image
//     sharp(imagePath)
//       .toBuffer()
//       .then((buffer) => {
//         const inserted = piexif.insert(exifStr, buffer.toString("binary"));
//         // fs.writeFileSync(imagePath, inserted, { encoding: "binary" });
//       });

//     // Save the modified image to a file
//   })
//   .catch((err) => {
//     console.error("Error extracting area:", err);
//   });

// setTimeout(() => {
//   fs.readFile(imagePath, (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     try {
//       // Load the EXIF data from the image
//       const exifObj = piexif.load(data.toString("binary"));
//       for (let key in exifObj.Exif) {
//         fs.writeFile(
//           `./${key}.jpeg`,
//           Buffer.from(exifObj.Exif[key], "base64"),
//           "binary",
//           (err) => {
//             if (err) {
//               console.error("Error saving image:", err);
//               return;
//             }
//             console.log("Image saved successfully.");
//           }
//         );
//       }
//       // Access and process the EXIF data as needed
//       console.log("EXIF Data:", Object.keys(exifObj.Exif));
//     } catch (err) {
//       console.error("Error reading EXIF data:", err);
//     }
//   });
// }, 800);
