import { BaseOptions } from './core/types';
declare class QrCodeWithLogo {
    static version: string;
    options: BaseOptions;
    ifCanvasDrawed: boolean;
    ifImageCreated: boolean;
    drawImagePromiseResolve: Function[];
    drawCanvasPromiseResolve: Function[];
    private drawImagePromise;
    private drawCanvasPromise;
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
