import { BaseOptions } from './model';
declare class QrCodeWithLogo {
    option: BaseOptions;
    ifCanvasDrawn: boolean;
    ifImageCreated: boolean;
    private defaultOption;
    constructor(option: BaseOptions);
    private toCanvas;
    private toImage;
    downloadImage(name?: string): Promise<boolean>;
    getImage(): Promise<HTMLImageElement>;
    getCanvas(): Promise<HTMLCanvasElement>;
}
export default QrCodeWithLogo;
