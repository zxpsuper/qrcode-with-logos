import { BaseOptions, Logo } from './types';
export declare class QRCanvas {
    private canvas;
    private options;
    /**row size */
    private size;
    /**qrcode version, from 1 - 40 */
    private version;
    private qrcodeArray;
    /**dotSize: Integer */
    private dotSize;
    /**offset: Integer */
    private offset;
    /**Don't draw dot in logo range */
    private inLogoRange;
    /**
     * clear canvas 清理畫布
     */
    clear(): void;
    get context(): CanvasRenderingContext2D;
    constructor(options: BaseOptions);
    /**
     * 保存qrcode原始數據
     * @param QRDATA
     */
    private saveQrdata;
    /**初始化 */
    init(): Promise<void>;
    drawLogo(): Promise<Function | null>;
    _drawLogo(logo: Logo): Promise<() => void>;
    /**
     * 目標坐標是否為黑點？
     * Coordinate is dark dot ? 0 or 1
     */
    isDark(x: number, y: number): boolean;
    isDisabled(x: number, y: number): boolean;
    setDisabled(x: number, y: number): number;
    /**
     * 畫背景
     */
    drawBackground(): void;
    /**
     * 画点
     */
    drawDots(): void;
    /**
     * 绘制角落定位图案
     */
    drawCorners(): void;
}
