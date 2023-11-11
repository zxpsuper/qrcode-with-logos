/*
 * @Author: super
 * @Date: 2019-06-27 16:29:34
 * @Last Modified by: super
 * @Last Modified time: 2019-06-27 16:47:22
 */
import { renderQrCode } from "./draw-canvas";
import { BaseOptions } from "./model";
import { drawLogo } from "./draw-logo";


export const toCanvas = (options: BaseOptions): Promise<void> => {
  return renderQrCode(options).then(() => drawLogo(options));
};
