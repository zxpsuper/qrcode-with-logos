import { BaseOptions } from './model';
import QrCodeWithLogo from './QrCodeWithLogo';
export declare const toImage: (options: BaseOptions, instance: QrCodeWithLogo) => Promise<any>;
/**save image */
export declare const saveImage: (image: HTMLImageElement, name: string) => Promise<boolean>;
