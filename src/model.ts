export interface Logo {
  src: string;
  logoRadius?: number;
  logoSize?: number;
  borderRadius?: number;
  borderColor?: string;
  borderSize?: number;
  bgColor?: string;
  crossOrigin?: string;
}

export interface NodeQrCodeOptions {
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: string;
  scale?: any;
}

export interface BaseOptions {
  content: string;
  width?: number;
  nodeQrCodeOptions?: NodeQrCodeOptions;
  logo?: Logo | string;
  canvas?: HTMLCanvasElement;
  image?: HTMLImageElement;
  download?: boolean | Function;
  downloadName?: string;
}
