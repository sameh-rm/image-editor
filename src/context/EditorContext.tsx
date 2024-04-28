import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  MutableRefObject
} from 'react';

// Define the shape of your context

interface EditorContextType {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  areas: CustomArea[];
  setAreas: React.Dispatch<React.SetStateAction<CustomArea[]>>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  selectedArea: CustomArea | undefined;
  setSelectedArea: React.Dispatch<React.SetStateAction<CustomArea | undefined>>;
  metadata: MetadataObjectType[];
  setMetadata: React.Dispatch<React.SetStateAction<MetadataObjectType[]>>;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        fileInputRef
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
    throw new Error('useEditor must be used within a EditorProvider');
  }
  return context;
};

export { EditorProvider, useEditor };
