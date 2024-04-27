import { IArea } from "@bmunozg/react-image-area";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context
interface EditorContextType {
  image: string | null;
  setImage: (image: string) => void;
  areas: IArea[];
  setAreas: (areas: IArea[]) => void;
}

// Create the context
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Create a custom provider to manage the Editor state
const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [image, setImage] = useState<string | null>(null);
  const [areas, setAreas] = useState<IArea[]>([]);

  return (
    <EditorContext.Provider value={{ image, setImage, areas, setAreas }}>
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
