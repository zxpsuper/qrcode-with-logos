"use strict";
/*
 * @Author: super
 * @Date: 2019-06-27 16:29:43
 * @Last Modified by: super
 * @Last Modified time: 2019-06-27 17:46:21
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = exports.isFunction = exports.promisify = void 0;
/**
 * promisify promise化，使得promisify(func).then()更加方便，不用每次都構造 promise
 * Making Promise more convenient, without having to construct a promise every time
 * @param f {function} 異步函數
 */
const promisify = (f) => {
    return function () {
        const args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            args.push(function (err, result) {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
            f.apply(null, args);
        });
    };
};
exports.promisify = promisify;
/**
 * 判斷是否是函數
 * Determine if it is a function
 * @param o {function} 函數
 */
function isFunction(o) {
    return typeof o === "function";
}
exports.isFunction = isFunction;
/**
 * 判斷是不是字符串
 * Determine if it is a string
 * @param o {string} 字符串
 */
function isString(o) {
    return typeof o === "string";
}
exports.isString = isString;
