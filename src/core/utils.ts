import { BaseOptions } from '../model'
// 对于内容少的QrCode，增大容错率
// Increase the fault tolerance for QrCode with less content
export function getErrorCorrectionLevel(content: string): string {
  if (content.length > 36) {
    return 'M'
  } else if (content.length > 16) {
    return 'Q'
  } else {
    return 'H'
  }
}

export function loadImage(
  logoSrc: string,
  crossOrigin: string
): Promise<HTMLImageElement> {
  const image = new Image()
  image.setAttribute('crossOrigin', crossOrigin || 'anonymous')
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
export function isFunction(o: any): boolean {
  return typeof o === 'function'
}

/**
 * canvas get base64 url and set image src value, if need download image, auto download image
 * @param options
 * @returns
 */
export const toImage = async function (options: BaseOptions) {
  const { canvas } = options

  const { image, downloadName } = options
  let { download } = options

  if (canvas!.toDataURL()) {
    image!.src = canvas!.toDataURL()
  } else {
    throw new Error('Can not get the canvas DataURL')
  }

  if (download !== true && !isFunction(download)) {
    return
  }

  download =
    download === true ? (start: Function): Promise<void> => start() : download

  const startDownload = () => {
    return saveImage(image!, downloadName)
  }

  if (download) {
    return download(startDownload)
  }

  return Promise.resolve()
}

/**
 * save image
 * @param image
 * @param name
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
      link.dispatchEvent(new MouseEvent('click'))
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * promisify promise化，使得promisify(func).then()更加方便，不用每次都構造 promise
 * Making Promise more convenient, without having to construct a promise every time
 * @param f {function} 異步函數
 */

export const promisify = (f: Function): Function => {
  return function () {
    const args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      args.push(function (err: object, result: object) {
        if (err) reject(err)
        else resolve(result)
      })
      f.apply(null, args)
    })
  }
}

/**
 * 判斷是不是字符串
 * Determine if it is a string
 * @param o {string} 字符串
 */
export function isString(o: any): boolean {
  return typeof o === 'string'
}

/**
 * 判斷是不是 image dom 節點
 * Determine if it is a dom
 * @param o image dom 節點
 */
export function isImageDom(o: any): boolean {
  return o && ['IMAGE', 'IMG'].includes(o.tagName)
}
