import React from "react";
import { useEditor } from "../context/EditorContext";
import { getAreaPayload } from "../utils/editor.utils";
import { toast } from "react-toastify";
import { ImageMetadataManager } from "../utils/ImageManager";

const imageManager = ImageMetadataManager.getInstance();
const SidePanel = () => {
  const {
    canvasRef,
    setMetadata,
    metadata,
    selectedArea,
    setSelectedArea,
    setAreas,
  } = useEditor();

  const addMetadataObject = (metadataObject: MetadataObjectType) => {
    const newMetadata = metadata.filter((mObj) => {
      return mObj.areaNumber !== metadataObject.areaNumber;
    });
    newMetadata.push(metadataObject);
    setMetadata((prev) => newMetadata);
  };

  const removeMetadataObject = (metadataObject: MetadataObjectType) => {
    const nextMetadata = metadata.filter(
      (m) => m.areaNumber !== metadataObject.areaNumber
    );
    setMetadata(nextMetadata);
    setAreas((areas) =>
      areas.filter((area) => metadataObject.areaNumber === area.areaNumber)
    );
  };

  const showSelectedArea = (obj: MetadataObjectType) => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");
    if (ctx && obj) {
      const chunkImage = new Image();
      chunkImage.src = obj.payload;
      chunkImage.onload = () => {
        ctx?.drawImage(
          chunkImage,
          obj.area.x - 1,
          obj.area.y - 1,
          obj.area.width + 2,
          obj.area.height + 1
        );
      };
      setSelectedArea(undefined);
    }
  };

  const handleShowSelectedArea = () => {
    const obj = metadata.find((mObj: MetadataObjectType) => {
      return selectedArea?.areaNumber === mObj.areaNumber;
    });
    console.log("handleShowSelectedArea", obj);
    if (obj) {
      showSelectedArea(obj);
      removeMetadataObject(obj);
    }
  };

  const HideArea = () => {
    if (!selectedArea) {
      toast("There are no selected area!", {
        type: "error",
      });
      return;
    }
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      const payload = getAreaPayload(selectedArea!, ctx);
      addMetadataObject({
        area: selectedArea,
        areaNumber: selectedArea.areaNumber || 1,
        payload,
      });
    }
  };

  const handleHideSelectedArea = () => {
    HideArea();
  };

  const handleShowAll = () => {
    metadata.forEach((obj) => {
      showSelectedArea(obj);
    });
    setAreas([]);
    setMetadata([]);
  };

  const handleDownload = () => {
    // handleFileSelect(image as string);

    if (!imageManager.commitImageMetadata(metadata))
      toast("Hidden data is too large for exif metadata");
    else {
      toast("Save Successfully");
    }
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
