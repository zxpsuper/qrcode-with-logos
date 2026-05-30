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
    private svgString;
    private svgPromise;
    private svgResolve;
    private svgReject;
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
     * Generate SVG string via QRSvg.
     * Also draws SVG onto canvas and sets image.src for backward compatibility.
     */
    private _toSvg;
    /**
     * Get image base64 and set image's src attribute .
     * @returns
     */
    private _toImage;
    /**
     * Get the generated SVG string.
     * Only available when renderer is 'svg'. Throws if renderer is 'canvas'.
     */
    getSvgString(): Promise<string>;
    downloadImage(name?: string): Promise<boolean>;
    getImage(): Promise<HTMLImageElement>;
    getCanvas(): Promise<HTMLCanvasElement>;
}
export default QrCodeWithLogo;
