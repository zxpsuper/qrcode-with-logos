import { QRCanvas } from './core/QRCanvas'
import { QRSvg } from './core/QRSvg'
import defaultOptions from './core/defaultOptions'
import { toImage, saveImage, isFunction } from './core/utils'
import { BaseOptions } from './core/types'

// VERSION will be replaced by rollup at build time
const VERSION = '0.0.0'

class QrCodeWithLogo {
  static version: string = VERSION
  options: BaseOptions
  ifCanvasDrawn: boolean = false
  ifImageCreated: boolean = false

  private canvasPromise: Promise<void>
  private imagePromise: Promise<void>
  private canvasResolve!: () => void
  private canvasReject!: (err: unknown) => void
  private imageResolve!: () => void
  private imageReject!: (err: unknown) => void

  private svgString: string | null = null
  private svgPromise: Promise<void>
  private svgResolve!: () => void
  private svgReject!: (err: unknown) => void

  private defaultOption: BaseOptions = {
    canvas: undefined,
    image: undefined,
    content: '',
    width: defaultOptions.width,
    download: defaultOptions.download,
    downloadName: defaultOptions.downloadName,
    nodeQrCodeOptions: {},
    cornersOptions: {},
    dotsOptions: {},
    renderer: defaultOptions.renderer
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
    this.svgPromise = new Promise<void>((resolve, reject) => {
      this.svgResolve = resolve
      this.svgReject = reject
    })

    // Check environment before try block - throw synchronously for clear error
    const isBrowser = typeof document !== 'undefined'
    const renderer = options.renderer || defaultOptions.renderer

    if (renderer !== 'svg' && !isBrowser) {
      throw new Error('Canvas renderer requires browser environment. Use renderer: "svg" for Node.js.')
    }

    try {
      this.options = Object.assign({}, this.defaultOption, options)

      // Only create canvas/image elements in browser environment or when needed
      if (this.options.renderer === 'svg') {
        // SVG mode: canvas/image only needed for backward compatibility (getImage)
        // In Node.js without canvas/image provided, skip creation
        if (isBrowser) {
          if (!this.options.canvas) {
            this.options.canvas = document.createElement('canvas')
          }
          if (!this.options.image) {
            this.options.image = document.createElement('img')
          }
        } else {
          // Node.js: use dummy elements if not provided
          // getImage/getCanvas will still fail but getSvgString works
          if (!this.options.canvas) {
            this.options.canvas = undefined as unknown as HTMLCanvasElement
          }
          if (!this.options.image) {
            this.options.image = undefined as unknown as HTMLImageElement
          }
        }
      } else {
        // Canvas mode: browser environment already verified above
        if (!this.options.canvas) {
          this.options.canvas = document.createElement('canvas')
        }
        if (!this.options.image) {
          this.options.image = document.createElement('img')
        }
      }

      if (this.options.renderer === 'svg') {
        this._toSvg()
          .then(() => {
            this.svgResolve()
          })
          .catch((error) => {
            if (options?.onError && isFunction(options.onError)) {
              options.onError(error)
            }
            this.svgReject(error)
            this.canvasReject(error)
            this.imageReject(error)
          })
      } else {
        this.svgResolve()
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
      }
    } catch (error) {
      if (options?.onError && isFunction(options.onError)) {
        options.onError(error)
      }
      this.canvasReject(error)
      this.imageReject(error)
      this.svgReject(error)
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
   * Generate SVG string via QRSvg.
   * Also draws SVG onto canvas and sets image.src for backward compatibility.
   */
  private async _toSvg(): Promise<void> {
    const qrSvg = new QRSvg(this.options)
    const svgStr = await qrSvg.init()
    this.svgString = svgStr
    this.ifCanvasDrawn = true
    this.canvasResolve()

    // Convert SVG to data URL and set as image source
    const dataUrl = 'data:image/svg+xml,' + encodeURIComponent(svgStr)
    if (this.options.image) {
      this.options.image.src = dataUrl
    }
    this.ifImageCreated = true
    this.imageResolve()

    // Handle download option — render SVG onto canvas for reliable PNG download
    const { download, downloadName } = this.options
    if (download !== true && !isFunction(download)) {
      return
    }
    const startDownload = async (): Promise<void> => {
      const width = this.options.width || defaultOptions.width
      const img = new Image()
      img.src = 'data:image/svg+xml,' + encodeURIComponent(svgStr)
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to render SVG for download'))
      })
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = width
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Failed to get canvas context')
      ctx.drawImage(img, 0, 0, width, width)
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = downloadName || defaultOptions.downloadName
      link.href = dataUrl
      document.body.appendChild(link)
      link.dispatchEvent(new MouseEvent('click'))
      document.body.removeChild(link)
    }
    if (download === true) {
      return startDownload()
    }
    if (isFunction(download)) {
      return (download as (start: () => Promise<void>) => Promise<void>)(startDownload)
    }
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

  /**
   * Get the generated SVG string.
   * Only available when renderer is 'svg'. Throws if renderer is 'canvas'.
   */
  public async getSvgString(): Promise<string> {
    await this.svgPromise
    if (this.svgString === null) {
      throw new Error('SVG string is not available. Use renderer: "svg" option.')
    }
    return this.svgString
  }

  public async downloadImage(name: string = defaultOptions.downloadName) {
    await this.imagePromise
    if (this.options.renderer === 'svg' && this.svgString) {
      // Render SVG onto canvas, download as PNG (preserves logo data URL)
      const width = this.options.width || defaultOptions.width
      const img = new Image()
      img.src = 'data:image/svg+xml,' + encodeURIComponent(this.svgString)
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to render SVG for download'))
      })
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = width
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Failed to get canvas context')
      ctx.drawImage(img, 0, 0, width, width)
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = name
      link.href = dataUrl
      document.body.appendChild(link)
      link.dispatchEvent(new MouseEvent('click'))
      document.body.removeChild(link)
      return true
    }
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
