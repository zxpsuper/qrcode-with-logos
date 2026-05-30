import { QRCanvas } from "./QRCanvas";
export type DrawArgs = {
    /**x坐标实际像素位置 */
    x: number;
    /**y坐标实际像素位置 */
    y: number;
    /**单元像素尺寸 */
    size: number;
    getNeighbor?: GetNeighbor;
    qrCanvas?: QRCanvas;
    /**x坐标 */
    i?: number;
    /**y坐标 */
    j?: number;
};
export type RotateFigureArgs = {
    x: number;
    y: number;
    size: number;
    rotation?: number;
    draw: () => void;
};
export type BasicCornerDrawArgs = {
    x: number;
    y: number;
    dotSize: number;
    radius?: number | {
        inner?: number;
        outer?: number;
    };
};
export type RotationCornerDrawArgs = BasicCornerDrawArgs & {
    rotation?: number;
};
export type BasicFigureDrawArgs = {
    x: number;
    y: number;
    size: number;
    rotation?: number;
};
export type GetNeighbor = (offsetX: number, offsetY: number) => boolean;
export type DrawArgsCanvas = DrawArgs & {
    context: CanvasRenderingContext2D;
};
export type DrawDotArgsCanvas = DrawArgsCanvas & {
    dotRate?: number;
};
export type BasicFigureDrawArgsCanvas = BasicFigureDrawArgs & {
    context: CanvasRenderingContext2D;
};
export type RotateFigureArgsCanvas = RotateFigureArgs & {
    context: CanvasRenderingContext2D;
};
export type DotType = 'dot' | 'dot-small' | 'tile' | 'rounded' | 'square' | 'diamond' | 'star' | 'fluid' | 'fluid-line' | 'stripe' | 'stripe-row' | 'stripe-column';
export type CornerType = 'square' | 'rounded' | 'circle' | 'rounded-circle' | 'circle-rounded' | 'circle-star' | 'circle-diamond';
export interface Logo {
    src: string;
    logoRadius?: number;
    borderRadius?: number;
    bgColor?: string;
    crossOrigin?: string;
    borderWidth?: number;
    /** Width of logo image (required when src is data URL in Node.js environment) */
    width?: number;
    /** Height of logo image (required when src is data URL in Node.js environment) */
    height?: number;
}
export type ErrorCorrectionLevel = 'L' | 'Q' | 'M' | 'H';
export interface NodeQrCodeOptions {
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
    errorCorrectionLevel?: ErrorCorrectionLevel;
    scale?: number;
}
export type DownloadFunction = (start: () => Promise<void>) => Promise<void>;
export type RendererType = 'canvas' | 'svg';
/** Minimal interface for QR data access used by SVG dot rendering */
export interface QrDataProvider {
    isDark(x: number, y: number): boolean;
    setDisabled(x: number, y: number): void;
    isDisabled(x: number, y: number): boolean;
}
export interface SvgDrawArgs {
    x: number;
    y: number;
    size: number;
    getNeighbor?: GetNeighbor;
    qrData?: QrDataProvider;
    i?: number;
    j?: number;
}
export interface SvgCornerDrawArgs {
    x: number;
    y: number;
    dotSize: number;
    radius?: number | {
        inner?: number;
        outer?: number;
    };
}
export interface BaseOptions {
    content: string;
    width?: number;
    nodeQrCodeOptions?: NodeQrCodeOptions;
    logo?: Logo | string;
    canvas?: HTMLCanvasElement;
    image?: HTMLImageElement;
    download?: boolean | DownloadFunction;
    downloadName?: string;
    dotsOptions?: {
        type?: DotType;
        color?: string;
    };
    cornersOptions?: {
        type?: CornerType;
        color?: string;
        radius?: number | {
            inner: number;
            outer: number;
        };
    };
    renderer?: RendererType;
    onError?: (err: Error) => void;
}
