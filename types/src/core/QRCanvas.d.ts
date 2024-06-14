import { BaseOptions, Logo } from './types';
export declare class QRCanvas {
    private canvas;
    private options;
    private size;
    private version;
    private qrcodeArray;
    private dotSize;
    private offset;
    private inLogoRange;
    /**
     * 清理画布
     */
    clear(): void;
    get context(): CanvasRenderingContext2D;
    constructor(options: BaseOptions);
    init(): Promise<void>;
    drawLogo(): Promise<void> | Promise<() => void>;
    _drawLogo(logo: Logo): Promise<() => void>;
    /**保存qrdata数据 */
    saveQrdata(QRDATA: any): void;
    /**是否为黑点 */
    isDark(x: number, y: number): boolean;
    /**画背景 */
    drawBackground(): void;
    /**画点 */
    drawDots(): void;
    /**
     * 绘制角落定位图案
     */
    drawCorners(): void;
}
