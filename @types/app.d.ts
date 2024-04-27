declare module "piexifjs";

type MetadataObjectType = {
  areaNumber: number;
  area: import("@bmunozg/react-image-area").IArea;
  payload: string;
};

type MetadataType = {
  [key: string]: MetadataObjectType | string | any;
};

type ExifObjectType = {
  Exif?: {
    [key: string]: any;
  };
  "0th"?: {
    [key: string]: any;
  };
  [key: any]: {
    [key: any]: any;
  };
};
