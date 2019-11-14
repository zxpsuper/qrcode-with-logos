/*
 * @Author: super
 * @Date: 2019-06-27 16:29:39
 * @Last Modified by: super
 * @Last Modified time: 2019-06-27 16:46:46
 */
import { BaseOptions } from "../types/index";
import { toCanvas } from "./toCanvas";
import { isFunction, isString } from "./utils";

export const toImage = (options: BaseOptions) => {
  const canvas = document.createElement("canvas");

  options.canvas = canvas;
  if (options.logo) {
    if (isString(options.logo)) {
      // @ts-ignore
      options.logo = { src: options.logo };
    }
    // @ts-ignore
    options.logo.crossOrigin = "Anonymous";
  }
  // @ts-ignore
  return toCanvas(options).then(() => {
    const { image = new Image(), downloadName = "qr-code" } = options;
    let { download } = options;
    // @ts-ignore
    image.src = canvas.toDataURL();

    if (download !== true && !isFunction(download)) {
      return;
    }
    download = download === true ? (start: Function) => start() : download;

    const startDownload: Function = () => {
      saveImage(image, downloadName);
    };

    download && download(startDownload);
    return new Promise((resolve, reject) => {
      resolve();
    });
  });
};


export const saveImage = (image: Element, name: string) => {
  // @ts-ignore
  const dataURL = image.src;

  const link = document.createElement("a");
  link.download = name;
  link.href = dataURL;
  link.dispatchEvent(new MouseEvent("click"));
};
