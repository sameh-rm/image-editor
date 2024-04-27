import { IArea } from "@bmunozg/react-image-area";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  MutableRefObject,
} from "react";

// Define the shape of your context
interface CustomArea extends IArea {
  areaNumber?: number;
}
interface EditorContextType {
  image: string | null;
  setImage: (image: string) => void;
  areas: CustomArea[];
  setAreas: React.Dispatch<React.SetStateAction<CustomArea[]>>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  selectedArea: CustomArea | undefined;
  setSelectedArea: React.Dispatch<React.SetStateAction<CustomArea | undefined>>;
  metadata: MetadataObjectType[];
  setMetadata: React.Dispatch<React.SetStateAction<MetadataObjectType[]>>;
}

// Create the context
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Create a custom provider to manage the Editor state
const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [image, setImage] = useState<string | null>(null);
  const [areas, setAreas] = useState<CustomArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<CustomArea>();
  const canvasRef = useRef(null);
  const [metadata, setMetadata] = useState<MetadataObjectType[]>([]);

  return (
    <EditorContext.Provider
      value={{
        image,
        setImage,
        areas,
        setAreas,
        canvasRef,
        selectedArea,
        setSelectedArea,
        metadata,
        setMetadata,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

// Create a custom hook to consume the context value
const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return context;
};

export { EditorProvider, useEditor };
