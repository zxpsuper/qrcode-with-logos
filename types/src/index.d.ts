import { BaseOptions } from "./model";
declare class QrCodeWithLogo {
    static version: string;
    option: BaseOptions;
    ifCanvasDrawed: boolean;
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
