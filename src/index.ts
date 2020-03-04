/*
 * @Author: super
 * @Date: 2019-06-27 16:29:31
 * @Last Modified by: suporka
 * @Last Modified time: 2020-03-04 12:24:50
 */

import { toCanvas } from "./toCanvas";
import { toImage, saveImage } from "./toImage";
import { IQrCodeWithLogo, BaseOptions } from "../types/index";

class QrCodeWithLogo implements IQrCodeWithLogo {
  option: BaseOptions;
  constructor(option: BaseOptions) {
    this.option = option;
    return this;
  }
  toCanvas = () => {
    return toCanvas.call(this, this.option);
  };
  toImage = () => {
    return toImage.call(this, this.option);
  };
  downloadImage = (name: string) => {
    saveImage(this.option.image, name);
  };
}

export default QrCodeWithLogo;
