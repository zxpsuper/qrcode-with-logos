"use strict";
/*
 * @Author: super
 * @Date: 2019-06-27 16:29:31
 * @Last Modified by: suporka
 * @Last Modified time: 2020-03-04 12:24:50
 */
Object.defineProperty(exports, "__esModule", { value: true });
const toCanvas_1 = require("./toCanvas");
const toImage_1 = require("./toImage");
class QrCodeWithLogo {
    constructor(option) {
        this.ifCanvasDrawn = false;
        this.ifImageCreated = false;
        this.defaultOption = {
            canvas: undefined,
            image: undefined,
            content: ''
        };
        this.option = Object.assign(this.defaultOption, option);
        if (!this.option.canvas) {
            this.option.canvas = document.createElement('canvas');
        }
        if (!this.option.image) {
            this.option.image = document.createElement('img');
        }
        this.toCanvas().then(this.toImage.bind(this));
    }
    toCanvas() {
        return toCanvas_1.toCanvas.call(this, this.option).then(() => {
            this.ifCanvasDrawn = true;
            return Promise.resolve();
        });
    }
    ;
    toImage() {
        return (0, toImage_1.toImage)(this.option, this);
    }
    async downloadImage(name = 'qrcode.png') {
        if (!this.ifImageCreated)
            await this.toImage();
        return (0, toImage_1.saveImage)(this.option.image, name);
    }
    async getImage() {
        if (!this.ifImageCreated)
            await this.toImage();
        return this.option.image;
    }
    async getCanvas() {
        if (!this.ifCanvasDrawn)
            await this.toCanvas();
        return this.option.canvas;
    }
}
exports.default = QrCodeWithLogo;
