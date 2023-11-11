/*
 * @Author: super
 * @Date: 2019-06-27 16:29:19
 * @Last Modified by: super
 * @Last Modified time: 2019-06-27 17:40:58
 */
import { BaseOptions, NodeQrCodeOptions } from "./model";
import { promisify } from "./utils";
// @ts-ignore
// import QRCode from "qrcode"
const QRCode = require("qrcode")

const toCanvas = promisify(QRCode.toCanvas);

export const renderQrCode = ({
  canvas,
  content,
  width = 0,
  nodeQrCodeOptions = {}
}: BaseOptions) => {
  // 容错率，默认对内容少的二维码采用高容错率，内容多的二维码采用低容错率
  // according to the content length to choose different errorCorrectionLevel
  nodeQrCodeOptions.errorCorrectionLevel =
    nodeQrCodeOptions.errorCorrectionLevel || getErrorCorrectionLevel(content);

  return getOriginWidth(content, nodeQrCodeOptions).then((_width: number) => {
    // 得到原始比例后还原至设定值，再放大4倍以获取高清图
    // Restore to the set value according to the original ratio, and then zoom in 4 times to get the HD image.
    nodeQrCodeOptions.scale = width === 0 ? undefined : (width / _width) * 4;
    // @ts-ignore
    return toCanvas(canvas, content, nodeQrCodeOptions);
  });
};

// 得到原QrCode的大小，以便缩放得到正确的QrCode大小
// Get the size of the original QrCode
const getOriginWidth = (
  content: string,
  nodeQrCodeOption: NodeQrCodeOptions
) => {
  const _canvas = document.createElement("canvas");
  // @ts-ignore
  return toCanvas(_canvas, content, nodeQrCodeOption).then(() => _canvas.width);
};

// 对于内容少的QrCode，增大容错率
// Increase the fault tolerance for QrCode with less content
const getErrorCorrectionLevel = (content: string): string => {
  if (content.length > 36) {
    return "M";
  } else if (content.length > 16) {
    return "Q";
  } else {
    return "H";
  }
};
