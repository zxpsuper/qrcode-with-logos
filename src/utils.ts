/*
 * @Author: super
 * @Date: 2019-06-27 16:29:43
 * @Last Modified by: super
 * @Last Modified time: 2019-06-27 17:46:21
 */

/**
 * promisify promise化，使得promisify(func).then()更加方便，不用每次都構造 promise
 * Making Promise more convenient, without having to construct a promise every time
 * @param f {function} 異步函數
 */

export const promisify = (f: Function): Function => {
  return function() {
    const args = Array.prototype.slice.call(arguments);
    return new Promise(function(resolve, reject) {
      args.push(function(err: object, result: object) {
        if (err) reject(err);
        else resolve(result);
      });
      f.apply(null, args);
    });
  };
};
/**
 * 判斷是否是函數
 * Determine if it is a function
 * @param o {function} 函數
 */
export function isFunction(o: any): boolean {
  return typeof o === "function";
}
/**
 * 判斷是不是字符串
 * Determine if it is a string
 * @param o {string} 字符串
 */
export function isString(o: any): boolean {
  return typeof o === "string";
}

/**
 * 判斷是不是 image dom 節點
 * Determine if it is a dom
 * @param o image dom 節點
 */
export function isImageDom(o: any): boolean {
  return o && ["IMAGE", "IMG"].includes(o.tagName);
}
