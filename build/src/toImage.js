"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveImage = exports.toImage = void 0;
const toCanvas_1 = require("./toCanvas");
const utils_1 = require("./utils");
const toImage = async function (options, instance) {
    const { canvas } = options;
    if (options.logo) {
        if ((0, utils_1.isString)(options.logo)) {
            options.logo = { src: options.logo };
        }
        ;
        options.logo.crossOrigin = 'Anonymous';
    }
    if (!instance.ifCanvasDrawn)
        await (0, toCanvas_1.toCanvas)(options);
    const { image, downloadName = 'qr-code' } = options;
    let { download } = options;
    if (canvas.toDataURL()) {
        image.src = canvas.toDataURL();
    }
    else {
        throw new Error('Can not get the canvas DataURL');
    }
    instance.ifImageCreated = true;
    if (download !== true && !(0, utils_1.isFunction)(download)) {
        return;
    }
    download = download === true ? (start) => start() : download;
    const startDownload = () => {
        return (0, exports.saveImage)(image, downloadName);
    };
    if (download) {
        return download(startDownload);
    }
    return Promise.resolve();
};
exports.toImage = toImage;
/**save image */
const saveImage = (image, name) => {
    return new Promise((resolve, reject) => {
        try {
            const dataURL = image.src;
            const link = document.createElement('a');
            link.download = name;
            link.href = dataURL;
            link.dispatchEvent(new MouseEvent('click'));
            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.saveImage = saveImage;
