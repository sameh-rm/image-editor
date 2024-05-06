# React Image Editor

This project is a mini website project for an Image Editor developed using React. It demonstrates various features and functionalities related to image editing.

## Features

- **Upload Image:** Users can upload an image from their local drive.
- **Display Panel:** A panel displays the uploaded image.
- **Hide Selected Area:** Users can select any area of the image to hide it. The selected area's coordinates and data buffer are saved into the image metadata, and a black box is added over the selected area.
- **Show Selected Area:** Users can show the hidden area by removing the black box from the selected area and pushing the data back to the image from the metadata.
- **Show All:** Users can show all hidden areas at once.
- **Download:** Users can download the edited image.
- **Persistence:** When a user re-uploads the saved image, they can perform all the previous actions, such as showing selected areas or showing all hidden areas.

## Technologies Used

- React
- JavaScript
- TypeScript
- HTML
- CSS (Tailwind CSS)

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npm start`.
