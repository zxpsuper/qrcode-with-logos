import { BaseOptions } from './core/types';
declare class QrCodeWithLogo {
    static version: string;
    options: BaseOptions;
    ifCanvasDrawn: boolean;
    ifImageCreated: boolean;
    private canvasPromise;
    private imagePromise;
    private canvasResolve;
    private canvasReject;
    private imageResolve;
    private imageReject;
    private defaultOption;
    constructor(options: BaseOptions);
    /**
     * Deprecated!
     */
    toCanvas(): void;
    /**
     * Deprecated!
     */
    toImage(): void;
    /**
     * draw canvas
     * @returns
     */
    private _toCanvas;
    /**
     * Get image base64 and set image's src attribute .
     * @returns
     */
    private _toImage;
    downloadImage(name?: string): Promise<boolean>;
    getImage(): Promise<HTMLImageElement>;
    getCanvas(): Promise<HTMLCanvasElement>;
}
export default QrCodeWithLogo;
