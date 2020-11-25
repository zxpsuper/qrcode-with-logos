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
  logo?: Logo | { src: string };
  canvas?: Element;
  image?: HTMLImageElement;
  download?: boolean | Function;
  downloadName?: string;
}

declare class IQrCodeWithLogo {
  constructor(option: BaseOptions)
  toCanvas(): Promise<any>;
  toImage(): Promise<any>;
  downloadImage(name: string): void;
}

export default IQrCodeWithLogo
