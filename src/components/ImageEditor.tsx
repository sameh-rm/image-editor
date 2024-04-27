import {
  AreaSelector,
  IArea,
  IAreaRendererProps,
} from "@bmunozg/react-image-area";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useEditor } from "../context/EditorContext";
import {
  getAreaPayload,
  ImageMetadataManager,
} from "../utils/editor.utils";

interface ImageEditorProps extends PropsWithChildren {}
const imageManager = ImageMetadataManager.getInstance();
const ImageEditor = ({ children }: ImageEditorProps) => {
  const { areas, setAreas } = useEditor();
  const { image: imageData, setImage: setImageData } = useEditor();
  const canvasRef = useRef(null);
  const onChangeHandler = (areas: IArea[]) => {
    setAreas(areas);
  };

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");
    const image = new Image();
    image.src = imageData as string;
    image.onload = () => {
      // Set canvas size to match the image size
      // Draw the image on the  canvas
      canvas.width = image.width;
      canvas.style.height = "80vh";
      canvas.style.maxWidth = "60vw";
      canvas.style.maxHeight = "60vw";
      canvas.height = canvas.offsetHeight;
      canvas.width = (canvas.offsetHeight * image.width) / image.height;
      // canvas.width =
      //   image.width < windowWidth
      //     ? image.width
      //     : (windowWidth * image.height) / image.width;
      // canvas.height =
      //   image.height < windowHeight
      //     ? image.height
      //     : (windowHeight * image.height) / image.width;
      if (ctx) {
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
        // Update state to indicate that the image is loaded
        imageManager.initImageData(canvas, imageData as string);
        const metadata = imageManager.getImageMetadata().Exif;
        console.log("metadata", metadata);
        const metadataAreas: IArea[] = [];
        Object.keys(metadata).forEach((key, keyIndex) => {
          try {
            const obj = JSON.parse(metadata[key]);
            if (typeof obj === "object") {
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
            }
          } catch (error) {}
        });
        setAreas(metadataAreas);
      }
    };
  }, [imageData]);
  const customRender = (areaProps: IAreaRendererProps) => {
    return (
      <div
        key={areaProps.areaNumber}
        onClick={() => {
          console.log(areaProps.areaNumber, areaProps.width);
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "black",
        }}
      />
    );
  };
  return (
    <div>
      <AreaSelector
        areas={areas}
        onChange={onChangeHandler}
        minWidth={20}
        minHeight={20}
        customAreaRenderer={customRender}
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
      <button
        onClick={() => {
          const canvas = canvasRef.current as unknown as HTMLCanvasElement;
          const ctx = canvas?.getContext("2d");
          if (ctx)
            areas.forEach((area, index) => {
              if (area.width > 0 && area.height > 0) {
                const payload = getAreaPayload(area, ctx);
                imageManager.insertImageMetadata(
                  index,
                  area,
                  payload,
                  areas.length
                );
              }
            });
            imageManager.commitImageMetadata()
        }}
      >
        Save
      </button>
    </div>
  );
};

export default ImageEditor;
