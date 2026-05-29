import { BaseOptions, ErrorCorrectionLevel } from './types'

/**
 * Normalize hex color strings: auto-prepend '#' if missing.
 * Handles 3/4/6/8 digit hex (e.g. 'fff', 'ffff', 'ffffff', 'ffffffff').
 * Non-hex strings (rgb, named colors, etc.) are returned unchanged.
 * @param color
 * @returns
 */
export function normalizeColor(color: string): string {
  if (!color) return color
  if (color.charAt(0) === '#') return color
  if (/^[0-9a-fA-F]{3,4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(color)) {
    return '#' + color
  }
  return color
}

// 對於内容少的qrcode，增大容錯率
// Increase the fault tolerance for QrCode with less content
export function getErrorCorrectionLevel(content: string): ErrorCorrectionLevel {
  if (content.length > 36) {
    return 'M'
  } else if (content.length > 16) {
    return 'Q'
  } else {
    return 'H'
  }
}

/**
 * load image, resolve image
 * 加載圖片
 * @param logoSrc
 * @param crossOrigin
 * @returns
 */
export function loadImage(
  logoSrc: string,
  crossOrigin?: string
): Promise<HTMLImageElement> {
  const image = new Image()
  if (crossOrigin) {
    image.setAttribute('crossOrigin', crossOrigin)
  } else {
    image.setAttribute('crossOrigin', 'anonymous')
  }
  image.src = logoSrc
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject('logo load fail!')
    }
  })
}

/**
 * draw radius
 * 繪製帶圓角的綫條
 * @param ctx
 * @returns
 */
export const canvasRoundRect =
  (ctx: CanvasRenderingContext2D) =>
  (x: number, y: number, w: number, h: number, r: number) => {
    const minSize = Math.min(w, h)
    if (r > minSize / 2) {
      r = minSize / 2
    }
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
    return ctx
  }

/**
 * 判斷是否是函數
 * Determine if it is a function
 * @param o {function} 函數
 */
export function isFunction(o: unknown): boolean {
  return typeof o === 'function'
}

/**
 * canvas get base64 url and set image src value, if need download image, auto download image
 * 獲取 canvas base64 並賦值給 image 的 src 屬性
 * @param options
 * @returns
 */
export const toImage = async function (options: BaseOptions) {
  const { canvas, image, download, downloadName } = options
  if (!canvas) {
    throw new Error('Canvas element is required')
  }
  const dataURL = canvas.toDataURL()
  if (dataURL) {
    image!.src = dataURL
  } else {
    throw new Error('Can not get the canvas DataURL')
  }
  if (download !== true && !isFunction(download)) {
    return
  }
  // download also can be a function
  const startDownload = (): Promise<void> => {
    return saveImage(image!, downloadName!) as unknown as Promise<void>
  }
  if (download === true) {
    return startDownload()
  }
  if (isFunction(download)) {
    return (download as (start: () => Promise<void>) => Promise<void>)(startDownload)
  }
  return Promise.resolve()
}

/**
 * save image 保存圖片
 * @param image HTMLImageElement
 * @param name image name
 * @returns
 */
export const saveImage = (
  image: HTMLImageElement,
  name: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const dataURL = image.src
      const link = document.createElement('a')
      link.download = name
      link.href = dataURL
      document.body.appendChild(link)
      link.dispatchEvent(new MouseEvent('click'))
      document.body.removeChild(link)
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}
