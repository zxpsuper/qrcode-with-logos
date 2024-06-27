import { QRCanvas } from './core/QRCanvas'
import defaultOptions from './core/defaultOptions'
import { toImage, saveImage, isFunction } from './core/utils'
import { BaseOptions } from './core/types'
import { version } from '../package.json'

class QrCodeWithLogo {
  static version: string = version
  options: BaseOptions
  ifCanvasDrawed: boolean = false
  ifImageCreated: boolean = false
  private drawImagePromiseResolve: Function[] = []
  private drawCanvasPromiseResolve: Function[] = []

  private drawImagePromise() {
    if (this.ifImageCreated) return Promise.resolve()
    return new Promise((resolve) => {
      this.drawImagePromiseResolve.push(resolve)
    })
  }

  private drawCanvasPromise() {
    if (this.ifCanvasDrawed) return Promise.resolve()
    return new Promise((resolve) => {
      this.drawCanvasPromiseResolve.push(resolve)
    })
  }

  private defaultOption: BaseOptions = {
    canvas: undefined,
    image: undefined,
    content: '',
    width: defaultOptions.width,
    download: defaultOptions.download,
    downloadName: defaultOptions.downloadName
  }

  constructor(options: BaseOptions) {
    try {
      this.options = Object.assign(this.defaultOption, options)
      if (!this.options.canvas)
        this.options.canvas = document.createElement('canvas')
      if (!this.options.image) this.options.image = document.createElement('img')
      this._toCanvas()
        .then(() => {
          return this._toImage()
        })
        .catch((error) => {
          if (options?.onError && isFunction(options.onError)) {
            options.onError(error)
          }
        })
    } catch (error) {
      if (options?.onError && isFunction(options.onError)) {
        options.onError(error)
      }
    }
  }

  /**
   * Deprecated!
   */
  toCanvas() {
    throw new Error('toCanvas has been Deprecated!')
  }

  /**
   * Deprecated!
   */
  toImage() {
    throw new Error('toImage has been Deprecated!')
  }

  /**
   * draw canvas
   * @returns
   */
  private _toCanvas(): Promise<void> {
    const qrCanvas = new QRCanvas(this.options)
    return qrCanvas.init().then(() => {
      this.ifCanvasDrawed = true
      this.drawCanvasPromiseResolve.forEach((fn) => {
        if (isFunction(fn)) fn()
      })
      this.drawCanvasPromiseResolve.length = 0
    })
  }

  /**
   * Get image base64 and set image's src attribute .
   * @returns
   */
  private async _toImage(): Promise<void> {
    return toImage(this.options).then(() => {
      this.ifImageCreated = true
      this.drawImagePromiseResolve.forEach((fn) => {
        if (isFunction(fn)) fn()
      })
      this.drawImagePromiseResolve.length = 0
    })
  }

  public async downloadImage(name: string = defaultOptions.downloadName) {
    await this.drawImagePromise()
    return saveImage(this.options.image!, name)
  }

  public async getImage(): Promise<HTMLImageElement> {
    await this.drawImagePromise()
    return this.options.image!
  }

  public async getCanvas(): Promise<HTMLCanvasElement> {
    await this.drawCanvasPromise()
    return this.options.canvas!
  }
}

export default QrCodeWithLogo
