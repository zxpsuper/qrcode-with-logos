/**
 * promisify promise化，使得promisify(func).then()更加方便，不用每次都構造 promise
 * Making Promise more convenient, without having to construct a promise every time
 * @param f {function} 異步函數
 */
export declare const promisify: (f: Function) => Function;
/**
 * 判斷是否是函數
 * Determine if it is a function
 * @param o {function} 函數
 */
export declare function isFunction(o: any): boolean;
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
