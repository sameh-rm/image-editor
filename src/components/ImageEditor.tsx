import { AreaSelector, IArea } from "@bmunozg/react-image-area";
import { PropsWithChildren, useEffect } from "react";
import { useEditor } from "../context/EditorContext";
import CustomSelectArea from "./CustomSelectArea";
import { ImageMetadataManager } from "../utils/ImageManager";
import { parseExifMetadata } from "../utils/editor.utils";

const imageManager = ImageMetadataManager.getInstance();

const ImageEditor = ({ children }: PropsWithChildren) => {
  const { areas, setAreas, canvasRef } = useEditor();
  const {
    image: imageData,
    metadata,
    setMetadata,
    setSelectedArea,
  } = useEditor();
  const onChangeHandler = (areas: IArea[]) => {
    setSelectedArea(undefined);

    setAreas(
      areas.map((a, index) => {
        return { ...a, areaNumber: index };
      })
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");
    const image = new Image();
    image.src = imageData as string;
    image.onload = () => {
      // Set canvas size to match the image size
      canvas.width = image.width;
      canvas.style.height = "80vh";
      canvas.style.maxWidth = "60vw";
      canvas.style.maxHeight = "60vw";
      canvas.height = canvas.offsetHeight;
      canvas.width = (canvas.offsetHeight * image.width) / image.height;
      if (ctx) {
        // Draw the image on the  canvas
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
        // Update state to indicate that the image is loaded
        imageManager.initImageData(canvas, imageData as string);

        const exifMetadata = imageManager.getImageMetadata();
        const metadataAreas: IArea[] = [];
        console.log("Exif metadata", exifMetadata);
        const metadata = parseExifMetadata(exifMetadata.Exif);
        setMetadata(metadata);
        metadata.forEach((obj) => {
          metadataAreas.push(obj.area);
          const image = new Image();
          image.src = obj.payload;
          ctx?.drawImage(
            image,
            obj.area.x - 1,
            obj.area.y - 1,
            obj.area.width + 2,
            obj.area.height + 1
          );
        });
        // setMetadata((prev) => [...prev, obj]);

        setAreas(metadataAreas);
      }
    };
  }, [imageData]);

  return (
    <div>
      <AreaSelector
        areas={areas}
        onChange={onChangeHandler}
        minWidth={20}
        minHeight={20}
        customAreaRenderer={CustomSelectArea}
      >
        <canvas
          style={{
            maxWidth: "70vw",
            maxHeight: "80vh",
            margin: "auto",
          }}
          ref={canvasRef}
        />
      </AreaSelector>
    </div>
  );
};

export default ImageEditor;
