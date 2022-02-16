/*
 * @Author: super
 * @Date: 2019-06-27 16:29:39
 * @Last Modified by: super
 * @Last Modified time: 2019-06-27 16:46:46
 */
import { BaseOptions } from "../types/index";
import { toCanvas } from "./toCanvas";
import { isFunction, isString } from "./utils";
import { Logo } from '../types/index'

export const toImage = async function (options: BaseOptions) {
  const { canvas } = options
  if (options.logo) {
    if (isString(options.logo)) {
      options.logo = { src: options.logo } as Logo;
    }
    (options.logo as Logo).crossOrigin = "Anonymous";
  }

  if (!this.ifCanvasDrawed) await toCanvas(options)

  let { image, downloadName = "qr-code" } = options;
  if (!image) image = new Image()
  let { download } = options;

  if (canvas.toDataURL()) image.src = canvas.toDataURL();
  else {
    throw new Error('Can not get the canvas DataURL')
  }

  this.ifImageCreated = true

  if (download !== true && !isFunction(download)) {
    return;
  }
  
  download = download === true ? (start: Function) => start() : download;

  const startDownload: Function = () => {
    saveImage(image, downloadName);
  };

  download && download(startDownload);

  return Promise.resolve();
};


export const saveImage = (image: HTMLImageElement, name: string): void => {
  const dataURL = image.src;
  const link = document.createElement("a");
  link.download = name;
  link.href = dataURL;
  link.dispatchEvent(new MouseEvent("click"));
};
