"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCanvas = void 0;
/*
 * @Author: super
 * @Date: 2019-06-27 16:29:34
 * @Last Modified by: super
 * @Last Modified time: 2019-06-27 16:47:22
 */
const draw_canvas_1 = require("./draw-canvas");
const draw_logo_1 = require("./draw-logo");
const toCanvas = (options) => {
    return (0, draw_canvas_1.renderQrCode)(options).then(() => (0, draw_logo_1.drawLogo)(options));
};
exports.toCanvas = toCanvas;
