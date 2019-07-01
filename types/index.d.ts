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
  logo?: Logo;
  canvas?: Element;
  image?: Element;
  download?: boolean | Function;
  downloadName?: string;
}

export interface IQrCodeWithLogo {
  toCanvas(): Promise<any>;
  toImage(): Promise<any>;
  downloadImage(name: string): void;
}

declare const QrCodeWithLogo: IQrCodeWithLogo;

export default QrCodeWithLogo;
