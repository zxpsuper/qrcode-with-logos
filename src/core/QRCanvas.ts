// @ts-ignore
import QRCode from 'qrcode'
import { BaseOptions, Logo } from './types'
import { canvasRoundRect, getErrorCorrectionLevel, loadImage } from './utils'
import QRDot from './QRDot'
import QRCorner from './QRCorner'
import defaultOptions from './defaultOptions'

const squareMask = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1]
]

const dotMask = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
]

const ErrorCorrectionPercents = {
  L: 0.07,
  M: 0.15,
  Q: 0.25,
  H: 0.3
}

export class QRCanvas {
  private canvas: HTMLCanvasElement
  private options: BaseOptions
  private size!: number
  private version!: number
  private qrcodeArray: number[] = []
  private dotSize = 0
  private offset = 0
  private inLogoRange: (i: number, j: number) => boolean

  /**
   * 清理画布
   */
  clear() {
    const canvasContext = this.context
    if (canvasContext) {
      canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  get context(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!
  }

  constructor(options: BaseOptions) {
    const { canvas, content, width = 380, nodeQrCodeOptions = {} } = options
    // 容错率，默认对内容少的二维码采用高容错率，内容多的二维码采用低容错率
    // according to the content length to choose different errorCorrectionLevel
    nodeQrCodeOptions.errorCorrectionLevel =
      nodeQrCodeOptions.errorCorrectionLevel || getErrorCorrectionLevel(content)

    const QRDATA = QRCode.create(content, nodeQrCodeOptions)
    this.canvas = canvas!
    this.options = options
    this.canvas.setAttribute('width', width + '')
    this.canvas.setAttribute('height', width + '')
    this.saveQrdata(QRDATA)
  }

  async init() {
    this.clear()
    this.drawBackground()
    const drawFunction = await this.drawLogo()
    this.drawDots()
    this.drawCorners()
    drawFunction && drawFunction.call(this)
  }

  drawLogo() {
    let logo = this.options?.logo
    if (logo) {
      if (typeof logo === 'string') {
        logo = { src: logo }
      }
      return this._drawLogo(logo)
    } else {
      return Promise.resolve()
    }
  }

  async _drawLogo(logo: Logo) {
    const context = this.context
    const canvas = this.canvas
    const coverLevel =
      ErrorCorrectionPercents[
        this.options.nodeQrCodeOptions.errorCorrectionLevel
      ]
    const maxHiddenDots = Math.floor(
      coverLevel * coverLevel * this.size * this.size
    )
    const {
      src,
      bgColor = defaultOptions.logo.bgColor,
      borderWidth = defaultOptions.logo.borderWidth,
      crossOrigin = defaultOptions.logo.crossOrigin,
      borderRadius = defaultOptions.logo.borderRadius,
      logoRadius = defaultOptions.logo.logoRadius
    } = logo
    const image = await loadImage(src, crossOrigin)
    const rate = image.width / image.height
    let logoWidth: number
    let logoHeight: number
    let logoInnerWidth: number
    let logoInnerHeight: number
    const maxHeight = Math.sqrt(
      (this.dotSize * this.dotSize * maxHiddenDots) / rate
    )
    if (rate > 1) {
      logoHeight = maxHeight
      logoInnerHeight = maxHeight - 2 * borderWidth
      logoInnerWidth = logoInnerHeight * rate
      logoWidth = logoInnerWidth + borderWidth * 2
    } else {
      logoWidth = maxHeight * rate
      logoInnerWidth = logoWidth - borderWidth * 2
      logoInnerHeight = logoInnerWidth / rate
      logoHeight = logoInnerHeight + 2 * borderWidth
    }
    const xStart = (this.size - Math.ceil(logoWidth / this.dotSize)) / 2
    const xEnd = this.size - xStart - 1
    const yStart = (this.size - Math.ceil(logoHeight / this.dotSize)) / 2
    const yEnd = this.size - yStart - 1
    this.inLogoRange = (i, j) => {
      return i >= xStart && i <= xEnd && j >= yStart && j <= yEnd
    }

    return function () {
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      context.translate(cx, cy)
      canvasRoundRect(context)(
        -logoWidth / 2,
        -logoHeight / 2,
        logoWidth,
        logoHeight,
        borderRadius
      )
      this.context.fillStyle = bgColor
      this.context.fill()

      // 使用image绘制可以避免某些跨域情况
      // Use image drawing to avoid some cross-domain situations
      const drawLogoWithImage = () => {
        context.drawImage(
          image,
          -logoInnerWidth / 2,
          -logoInnerHeight / 2,
          logoInnerWidth,
          logoInnerHeight
        )
      }

      // 使用canvas绘制以获得更多的功能
      // Use canvas to draw more features, such as borderRadius
      const drawLogoWithCanvas = () => {
        const canvasImage = document.createElement('canvas')
        canvasImage.width = logoInnerWidth
        canvasImage.height = logoInnerHeight
        canvasImage
          .getContext('2d')!
          .drawImage(image, 0, 0, logoInnerWidth, logoInnerHeight)

        canvasRoundRect(context)(
          0,
          0,
          logoInnerWidth,
          logoInnerHeight,
          logoRadius
        )
        // @ts-ignore
        context.fillStyle = context.createPattern(canvasImage, 'no-repeat')
        context.fill()
      }

      if (logoRadius) {
        context.translate(-logoInnerWidth / 2, -logoInnerHeight / 2)
        drawLogoWithCanvas()
        context.translate(-cx + logoInnerWidth / 2, -cy + logoInnerHeight / 2)
      } else {
        drawLogoWithImage()
        context.translate(-cx, -cy)
      }
    }
  }

  /**保存qrdata数据 */
  saveQrdata(QRDATA: any) {
    this.size = QRDATA.modules.size
    this.version = QRDATA.version
    this.qrcodeArray = QRDATA.modules.data
    const { nodeQrCodeOptions } = this.options
    const margin = nodeQrCodeOptions?.margin || 4
    const count = this.size
    const width = this.options.width || 180
    /**二维码除去margin的实际宽度 */
    const minSize = width - margin * 2
    /**每个像素点宽度 */
    this.dotSize = Math.floor(minSize / count)
    this.offset = Math.floor((width - count * this.dotSize) / 2)
  }

  /**是否为黑点 */
  isDark(x: number, y: number) {
    return this.qrcodeArray[x + y * this.size] === 1
  }

  /**画背景 */
  drawBackground() {
    const canvasContext = this.context
    const { nodeQrCodeOptions } = this.options
    const light = nodeQrCodeOptions?.color?.light || defaultOptions.nodeQrCodeOptions.color.light
    if (canvasContext) {
      canvasContext.fillStyle = light
      canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  /**画点 */
  drawDots() {
    const canvasContext = this.context
    if (canvasContext) {
      const count = this.size
      /**每个像素点宽度 */
      const dotSize = this.dotSize
      /**二维码起始位置x */
      const xBeginning = this.offset
      /**二维码起始位置y */
      const yBeginning = this.offset
      const that = this
      /**@ts-ignore 排除定位点 */
      function filterDots(i: number, j: number) {
        // 排除定位点外框
        if (
          squareMask[i]?.[j] ||
          squareMask[i - count + 7]?.[j] ||
          squareMask[i]?.[j - count + 7]
        ) {
          return false
        }
        // 排除定位点
        if (
          dotMask[i]?.[j] ||
          dotMask[i - count + 7]?.[j] ||
          dotMask[i]?.[j - count + 7]
        ) {
          return false
        }
        if (that.inLogoRange && that.inLogoRange(i, j)) return false

        return true
      }

      const dot = new QRDot({
        context: this.context!,
        type: this.options.dotsOptions?.type || defaultOptions.dotsOptions.type
      })
      canvasContext.fillStyle = canvasContext.strokeStyle =
        this.options.dotsOptions?.color ||
        this.options.nodeQrCodeOptions?.color?.dark ||
        defaultOptions.dotsOptions.color

      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          if (!filterDots(i, j)) {
            continue
          }
          if (!this.isDark(i, j)) {
            continue
          }
          dot.draw(
            xBeginning + i * dotSize,
            yBeginning + j * dotSize,
            dotSize,
            (xOffset: number, yOffset: number): boolean => {
              if (
                i + xOffset < 0 ||
                j + yOffset < 0 ||
                i + xOffset >= count ||
                j + yOffset >= count
              )
                return false
              if (!filterDots(i + xOffset, j + yOffset)) return false
              return this.isDark(i + xOffset, j + yOffset)
            }
          )
        }
      }
      canvasContext.fill()
    }
  }

  /**
   * 绘制角落定位图案
   */
  drawCorners() {
    const canvasContext = this.context
    if (canvasContext) {
      const { nodeQrCodeOptions } = this.options
      const margin = nodeQrCodeOptions?.margin || defaultOptions.nodeQrCodeOptions.margin
      const count = this.size
      const width = this.options.width || defaultOptions.width
      /**二维码除去margin的实际宽度 */
      const minSize = width - margin * 2
      /**每个像素点宽度 */
      const dotSize = Math.floor(minSize / count)
      /**二维码起始位置x */
      const xBeginning = Math.floor((width - count * dotSize) / 2)
      /**二维码起始位置y */
      const yBeginning = Math.floor((width - count * dotSize) / 2)

      ;[
        [0, 0],
        [1, 0],
        [0, 1]
      ].forEach(([column, row]) => {
        const x = xBeginning + column * dotSize * (count - 7)
        const y = yBeginning + row * dotSize * (count - 7)
        const cornersOptions = this.options.cornersOptions
        const corner = new QRCorner(
          this.context,
          cornersOptions.type,
          cornersOptions.color ||
            this.options?.nodeQrCodeOptions?.color?.dark ||
            defaultOptions.cornersOptions.color
        )
        corner.draw({
          x,
          y,
          cellSize: this.dotSize,
          radius: cornersOptions.radius
        })
      })
    }
  }
}
