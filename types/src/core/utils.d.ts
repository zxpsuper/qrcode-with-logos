import { BaseOptions, ErrorCorrectionLevel } from './types';
/**
 * Normalize hex color strings: auto-prepend '#' if missing.
 * Handles 3/4/6/8 digit hex (e.g. 'fff', 'ffff', 'ffffff', 'ffffffff').
 * Non-hex strings (rgb, named colors, etc.) are returned unchanged.
 * @param color
 * @returns
 */
export declare function normalizeColor(color: string): string;
export declare function getErrorCorrectionLevel(content: string): ErrorCorrectionLevel;
/**
 * load image, resolve image
 * 加載圖片
 * @param logoSrc
 * @param crossOrigin
 * @returns
 */
export declare function loadImage(logoSrc: string, crossOrigin?: string): Promise<HTMLImageElement>;
/**
 * draw radius
 * 繪製帶圓角的綫條
 * @param ctx
 * @returns
 */
export declare const canvasRoundRect: (ctx: CanvasRenderingContext2D) => (x: number, y: number, w: number, h: number, r: number) => CanvasRenderingContext2D;
/**
 * 判斷是否是函數
 * Determine if it is a function
 * @param o {function} 函數
 */
export declare function isFunction(o: unknown): boolean;
/**
 * canvas get base64 url and set image src value, if need download image, auto download image
 * 獲取 canvas base64 並賦值給 image 的 src 屬性
 * @param options
 * @returns
 */
export declare const toImage: (options: BaseOptions) => Promise<void>;
/**
 * save image 保存圖片
 * @param image HTMLImageElement
 * @param name image name
 * @returns
 */
export declare const saveImage: (image: HTMLImageElement, name: string) => Promise<boolean>;
