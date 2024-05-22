"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderQrCode = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const qrcode_1 = tslib_1.__importDefault(require("qrcode"));
const toCanvas = (0, utils_1.promisify)(qrcode_1.default.toCanvas);
const renderQrCode = ({ canvas, content, width = 0, nodeQrCodeOptions = {} }) => {
    // 容错率，默认对内容少的二维码采用高容错率，内容多的二维码采用低容错率
    // according to the content length to choose different errorCorrectionLevel
    nodeQrCodeOptions.errorCorrectionLevel =
        nodeQrCodeOptions.errorCorrectionLevel || getErrorCorrectionLevel(content);
    return getOriginWidth(content, nodeQrCodeOptions).then((_width) => {
        // 得到原始比例后还原至设定值，再放大4倍以获取高清图
        // Restore to the set value according to the original ratio, and then zoom in 4 times to get the HD image.
        nodeQrCodeOptions.scale = width === 0 ? undefined : (width / _width) * 4;
        // @ts-ignore
        return toCanvas(canvas, content, nodeQrCodeOptions);
    });
};
exports.renderQrCode = renderQrCode;
// 得到原QrCode的大小，以便缩放得到正确的QrCode大小
// Get the size of the original QrCode
const getOriginWidth = (content, nodeQrCodeOption) => {
    const _canvas = document.createElement('canvas');
    // @ts-ignore
    return toCanvas(_canvas, content, nodeQrCodeOption).then(() => _canvas.width);
};
// 对于内容少的QrCode，增大容错率
// Increase the fault tolerance for QrCode with less content
const getErrorCorrectionLevel = (content) => {
    if (content.length > 36) {
        return 'M';
    }
    else if (content.length > 16) {
        return 'Q';
    }
    else {
        return 'H';
    }
};
