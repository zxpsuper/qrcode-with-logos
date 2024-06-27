import { BaseOptions, ErrorCorrectionLevel } from './types';
export declare function getErrorCorrectionLevel(content: string): ErrorCorrectionLevel;
/**
 * load image, resolve image
 * 加載圖片
 * @param logoSrc
 * @param crossOrigin
 * @returns
 */
export declare function loadImage(logoSrc: string, crossOrigin: string): Promise<HTMLImageElement>;
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
export declare function isFunction(o: any): boolean;
/**
 * canvas get base64 url and set image src value, if need download image, auto download image
 * 獲取 canvas base64 並賦值給 image 的 src 屬性
 * @param options
 * @returns
 */
export declare const toImage: (options: BaseOptions) => Promise<any>;
/**
 * save image 保存圖片
 * @param image HTMLImageElement
 * @param name image name
 * @returns
 */
export declare const saveImage: (image: HTMLImageElement, name: string) => Promise<boolean>;
/**
 * promisify promise化，使得promisify(func).then()更加方便，不用每次都構造 promise
 * Making Promise more convenient, without having to construct a promise every time
 * @param f {function} 異步函數
 */
export declare const promisify: (f: Function) => Function;
/**
 * 判斷是不是字符串
 * Determine if it is a string
 * @param o {string} 字符串
 */
export declare function isString(o: any): boolean;
/**
 * 判斷是不是 image dom 節點
 * Determine if it is a dom
 * @param o image dom 節點
 */
export declare function isImageDom(o: any): boolean;
