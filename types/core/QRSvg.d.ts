import { BaseOptions, QrDataProvider } from './types';
export declare class QRSvg implements QrDataProvider {
    private options;
    private size;
    private version;
    private qrcodeArray;
    private dotSize;
    private offset;
    private inLogoRange;
    constructor(options: BaseOptions);
    private saveQRData;
    isDark(x: number, y: number): boolean;
    isDisabled(x: number, y: number): boolean;
    setDisabled(x: number, y: number): void;
    /**
     * Main entry: generate full SVG string.
     * Returns SVG XML string (not wrapped in promise since logo is optional).
     */
    init(): Promise<string>;
    private drawBackground;
    /**
     * Start logo image loading and return a function that generates SVG logo markup.
     * Must be called before drawDots() so inLogoRange is set up.
     */
    private drawLogo;
    private _drawLogo;
    private drawDots;
    private drawCorners;
}
