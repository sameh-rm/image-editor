import React, { useRef } from "react";
import ImageEditor from "./ImageEditor";
import { useEditor } from "../context/EditorContext";
// open image
const ImageUploadInput: React.FC = () => {
  const { image, setImage } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result as string);
    };
  };

  const handleOpenFileDialog = () => {
    if (!image)
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="bg-gray-200 shadow-md rounded-md p-4 w-full flex justify-center h-full">
      <div
        className="border-2 border-gray-300 border-dashed p-8 flex-1 cursor-pointer h-full flex justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleOpenFileDialog}
      >
        <input
          type="file"
          accept="image/jpeg"
          onChange={handleInputChange}
          className="hidden"
          ref={fileInputRef}
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          {image ? (
            <ImageEditor />
          ) : (
            <div className="text-center">
              <span className="text-gray-400">Drop your image here or</span>
              <br />
              <span className="text-blue-600">browse</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default ImageUploadInput;
