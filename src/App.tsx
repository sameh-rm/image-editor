import React, { useState } from "react";
import ImageUploadInput from "./components/ImageUploadInput";
import ImageEditor from "./components/ImageEditor";
import SidePanel from "./components/SidePanel";
import { EditorProvider } from "./context/EditorContext";
import './App.css'
const App: React.FC = () => {
  return (
    <>
      <div className="bg-gray-100 h-screen w-screen sm:px-8 md:px-16 sm:py-8">
        <main className="flex gap-4 h-full">
          <EditorProvider>
            <SidePanel />
            <ImageUploadInput />
          </EditorProvider>
        </main>
      </div>
    </>
  );
};

export default App;
