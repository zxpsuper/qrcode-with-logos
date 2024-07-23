import { BaseOptions } from './core/types';
declare class QrCodeWithLogo {
    static version: string;
    options: BaseOptions;
    ifCanvasDrawed: boolean;
    ifImageCreated: boolean;
    private drawImagePromiseResolve;
    private drawImagePromiseReject;
    private drawCanvasPromiseResolve;
    private drawCanvasPromiseReject;
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
    /**
     * 批量执行 resolve reject
     * @param name
     * @param err
     */
    private batchRunFunction;
    downloadImage(name?: string): Promise<boolean>;
    getImage(): Promise<HTMLImageElement>;
    getCanvas(): Promise<HTMLCanvasElement>;
}
export default QrCodeWithLogo;
