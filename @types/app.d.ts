declare module 'piexifjs';

type MetadataObjectType = {
  uniqueId: number;
  area: import('@bmunozg/react-image-area').IArea;
  payload: string;
};

type MetadataType = {
  [key: string]: MetadataObjectType | string | any;
};

type IArea = import('@bmunozg/react-image-area').IArea;
interface CustomArea extends IArea {
  areaNumber?: number;
  uniqueId?: number;
}
