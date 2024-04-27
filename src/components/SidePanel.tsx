import React from "react";
import { useEditor } from "../context/EditorContext";

const SidePanel = () => {
  const { image } = useEditor();
  const handleShowSelectedArea = () => {
    // Implement logic to show selected area
  };

  const handleHideSelectedArea = () => {
    // Implement logic to hide selected area
  };

  const handleShowAll = () => {
    // Implement logic to show all
  };

  const handleDownload = () => {
    // Implement logic to download
    // handleFileSelect(image as string);
  };
  return (
    <div className="w-1/4 p-4 bg-white shadow-md rounded-md flex-col">
      <button
        onClick={handleShowSelectedArea}
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded mb-2 w-full"
      >
        Show selected area
      </button>

      <button
        onClick={handleHideSelectedArea}
        className="bg-waikawa-gray-500 hover:bg-waikawa-gray-600 text-white font-bold py-2 px-4 rounded mb-2 w-full"
      >
        Hide selected area
      </button>

      <button
        onClick={handleShowAll}
        className="bg-cerise-red-700 hover:bg-cerise-red-600 text-gray-200 font-bold py-2 px-4 rounded mb-2 w-full "
      >
        Show All
      </button>

      <button
        onClick={handleDownload}
        className="bg-black hover:bg-gray-700 mt-auto text-white font-bold py-2 px-4 rounded mb-2 w-full"
      >
        Download
      </button>
    </div>
  );
};

export default SidePanel;
