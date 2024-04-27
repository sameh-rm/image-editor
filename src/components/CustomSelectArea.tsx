import { IAreaRendererProps } from "@bmunozg/react-image-area";
import React, { useEffect, useState } from "react";
import { useEditor } from "../context/EditorContext";

const CustomSelectArea = (areaProps: IAreaRendererProps) => {
  const { selectedArea, setSelectedArea, metadata } = useEditor();
  const [isSelected, setIsSelected] = useState(
    selectedArea?.areaNumber === areaProps.areaNumber
  );
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setIsSelected(selectedArea?.areaNumber === areaProps.areaNumber);
  }, [selectedArea, areaProps]);

  useEffect(() => {
    const exists = metadata.find(
      (mObj) => mObj.areaNumber === areaProps.areaNumber
    );
    setIsHidden(!!exists);
  }, [metadata]);

  return (
    <div
      key={areaProps.areaNumber}
      onClick={() => {
        setSelectedArea(areaProps);
      }}
      style={{
        width: "100%",
        height: "100%",
        background: isHidden ? "rgb(0,0,0)" : "rgba(0,0,0,.6)",
        border: isSelected
          ? "3px solid rgba(50, 50 ,250, .6)"
          : "1px dashed rgba(0, 0, 0, 0.5)",
        outline: isSelected ? "unset" : "rgba(255, 255, 255, 0.5) dashed 1px",
      }}
    >
      <h1 className="text-lg text-red-700">{areaProps.areaNumber}</h1>
    </div>
  );
};

export default CustomSelectArea;
