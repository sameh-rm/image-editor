import React from 'react';
import { useEditor } from '../context/EditorContext';
import { toast } from 'react-toastify';
import { ImageMetadataManager } from '../utils/ImageManager';

const imageManager = ImageMetadataManager.getInstance();
const SidePanel = () => {
  const {
    canvasRef,
    setMetadata,
    metadata,
    selectedArea,
    setSelectedArea,
    setAreas,
    setImage
  } = useEditor();

  const addMetadataObject = (metadataObject: MetadataObjectType) => {
    const isExisted = metadata.find((mObj) => {
      return mObj.uniqueId === metadataObject.uniqueId;
    });

    if(isExisted) {
      toast("You cant hide a hidden area, create a new selected Area",{type:"error"})
      return
    }
    setMetadata(prev=> [...prev, metadataObject]);
  };

  const removeMetadataObject = (metadataObject: MetadataObjectType) => {
    const nextMetadata = metadata.filter(
      (m) => m.uniqueId !== metadataObject.uniqueId
    );
    setMetadata(nextMetadata);
    setAreas((areas) =>
      areas.filter((area) => metadataObject.uniqueId !== area.uniqueId)
    );
  };

  const showSelectedArea = (obj: MetadataObjectType) => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
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
    if (!selectedArea) {
      toast('There are no selected area!', {
        type: 'error'
      });
      return;
    }

    const obj = metadata.find((mObj: MetadataObjectType) => {
      return selectedArea?.uniqueId === mObj.uniqueId;
    });

    if (obj) {
      showSelectedArea(obj);
      removeMetadataObject(obj);
    }
  };

  const HideArea = () => {
    if (!selectedArea) {
      toast('There are no selected area!', {
        type: 'error'
      });
      return;
    }

    const payload = imageManager.getAreaPayload(selectedArea!);
    addMetadataObject({
      area: selectedArea,
      uniqueId: selectedArea.uniqueId,
      payload
    });
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
    imageManager.commitImageMetadata(metadata);
    setImage(undefined);
  };

  return (
    <div className="w-1/4 p-4 bg-white shadow-md rounded-md flex-col">
      <button
        onClick={handleShowSelectedArea}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mb-2 w-full"
      >
        Show selected area
      </button>

      <button
        onClick={handleHideSelectedArea}
        className="bg-cerise-red-700 hover:bg-cerise-red-600 text-white font-bold py-2 px-4 rounded mb-2 w-full"
      >
        Hide selected area
      </button>

      <button
        onClick={handleShowAll}
        className="bg-sky-700 hover:bg-sky-600 text-gray-200 font-bold py-2 px-4 rounded mb-2 w-full "
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
