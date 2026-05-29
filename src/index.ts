import { QRCanvas } from './core/QRCanvas'
import defaultOptions from './core/defaultOptions'
import { toImage, saveImage, isFunction } from './core/utils'
import { BaseOptions } from './core/types'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json')
const { version } = pkg

class QrCodeWithLogo {
  static version: string = version
  options: BaseOptions
  ifCanvasDrawn: boolean = false
  ifImageCreated: boolean = false

  private canvasPromise: Promise<void>
  private imagePromise: Promise<void>
  private canvasResolve!: () => void
  private canvasReject!: (err: unknown) => void
  private imageResolve!: () => void
  private imageReject!: (err: unknown) => void

  private defaultOption: BaseOptions = {
    canvas: undefined,
    image: undefined,
    content: '',
    width: defaultOptions.width,
    download: defaultOptions.download,
    downloadName: defaultOptions.downloadName,
    nodeQrCodeOptions: {},
    cornersOptions: {},
    dotsOptions: {}
  }

  constructor(options: BaseOptions) {
    this.canvasPromise = new Promise<void>((resolve, reject) => {
      this.canvasResolve = resolve
      this.canvasReject = reject
    })
    this.imagePromise = new Promise<void>((resolve, reject) => {
      this.imageResolve = resolve
      this.imageReject = reject
    })

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
          this.canvasReject(error)
          this.imageReject(error)
        })
    } catch (error) {
      if (options?.onError && isFunction(options.onError)) {
        options.onError(error)
      }
      this.canvasReject(error)
      this.imageReject(error)
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
      this.ifCanvasDrawn = true
      this.canvasResolve()
    })
  }

  /**
   * Get image base64 and set image's src attribute .
   * @returns
   */
  private async _toImage(): Promise<void> {
    return toImage(this.options).then(() => {
      this.ifImageCreated = true
      this.imageResolve()
    })
  }

  public async downloadImage(name: string = defaultOptions.downloadName) {
    await this.imagePromise
    return saveImage(this.options.image!, name)
  }

  public async getImage(): Promise<HTMLImageElement> {
    await this.imagePromise
    return this.options.image!
  }

  public async getCanvas(): Promise<HTMLCanvasElement> {
    await this.canvasPromise
    return this.options.canvas!
  }
}

export default QrCodeWithLogo
