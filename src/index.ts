/*
 * @Author: super
 * @Date: 2019-06-27 16:29:31
 * @Last Modified by: suporka
 * @Last Modified time: 2020-03-04 12:24:50
 */

import { toCanvas } from "./toCanvas";
import { toImage, saveImage } from "./toImage";
import { BaseOptions } from "../types/index";
import { version } from '../package.json'
class QrCodeWithLogo {

  static version: string = version

  option: BaseOptions;
  ifCanvasDrawed: boolean = false
  ifImageCreated: boolean = false

  private defaultOption: BaseOptions = {
    canvas: document.createElement("canvas"),
    image: new Image(),
    content: ''
  }

  constructor(option: BaseOptions) {
    this.option = Object.assign(this.defaultOption, option);
  }

  public toCanvas(): Promise<void> {
    return toCanvas.call(this, this.option).then(() => {
      this.ifCanvasDrawed = true
      return Promise.resolve()
    })
  };
  public toImage(): Promise<void> {
    return toImage.call(this, this.option);
  }
  public async downloadImage(name: string) {
    if (!this.ifImageCreated) await this.toImage()
    saveImage(this.option.image, name);
  }
  public async getCanvas(): Promise<HTMLCanvasElement> {
    if (!this.ifCanvasDrawed) await this.toCanvas()
    return this.option.canvas
  }

}

export default QrCodeWithLogo;
