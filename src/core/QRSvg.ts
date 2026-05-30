import QRCode from 'qrcode'
import { BaseOptions, Logo, SvgDrawArgs, QrDataProvider } from './types'
import {
  getErrorCorrectionLevel,
  loadImage,
  normalizeColor,
} from './utils'
import { wrapSvg, svgRect, svgCircle, svgGroup, roundRectPath, svgPath } from './svgUtils'
import SvgDot from './SvgDot'
import SvgCorner from './SvgCorner'
import defaultOptions from './defaultOptions'

const squareMask = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
]

const dotMask = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
]

const ErrorCorrectionPercents: Record<string, number> = {
  L: 0.07,
  M: 0.15,
  Q: 0.25,
  H: 0.3,
}

export class QRSvg implements QrDataProvider {
  private options: BaseOptions
  private size!: number
  private version!: number
  private qrcodeArray: number[] = []
  private dotSize: number = 0
  private offset: number = 0
  private inLogoRange: ((i: number, j: number) => boolean) | null = null

  constructor(options: BaseOptions) {
    const {
      content,
      width = defaultOptions.width,
      nodeQrCodeOptions = {},
    } = options

    nodeQrCodeOptions.errorCorrectionLevel =
      nodeQrCodeOptions.errorCorrectionLevel ||
      getErrorCorrectionLevel(content)

    const QRDATA = QRCode.create(content, nodeQrCodeOptions)
    this.options = options
    this.saveQRData(QRDATA)
  }

  private saveQRData(QRDATA: any) {
    this.size = QRDATA.modules.size
    this.version = QRDATA.version
    this.qrcodeArray = QRDATA.modules.data
    const { nodeQrCodeOptions } = this.options
    const margin =
      nodeQrCodeOptions?.margin || defaultOptions.nodeQrCodeOptions.margin
    const count = this.size
    const width = this.options?.width || defaultOptions.width
    const withoutMarginSize = width - margin * 2
    this.dotSize = Math.floor(withoutMarginSize / count)
    this.offset = Math.floor((width - count * this.dotSize) / 2)
  }

  isDark(x: number, y: number): boolean {
    return this.qrcodeArray[x + y * this.size] === 1
  }

  isDisabled(x: number, y: number): boolean {
    return this.qrcodeArray[x + y * this.size] === 2
  }

  setDisabled(x: number, y: number) {
    this.qrcodeArray[x + y * this.size] = 2
  }

  /**
   * Main entry: generate full SVG string.
   * Returns SVG XML string (not wrapped in promise since logo is optional).
   */
  async init(): Promise<string> {
    const width = this.options.width || defaultOptions.width
    let body = ''

    // Background
    body += this.drawBackground()

    // Logo setup (defines inLogoRange, starts image load)
    const logoDrawFn = await this.drawLogo()

    // Dots
    body += this.drawDots()

    // Corners
    body += this.drawCorners()

    // Logo (after dots/corners, on top)
    if (logoDrawFn) {
      body += logoDrawFn()
    }

    return wrapSvg(body, width)
  }

  private drawBackground(): string {
    const { nodeQrCodeOptions } = this.options
    const light =
      nodeQrCodeOptions?.color?.light ||
      defaultOptions.nodeQrCodeOptions.color.light
    const width = this.options.width || defaultOptions.width
    return svgRect(0, 0, width, width, {
      fill: normalizeColor(light),
    })
  }

  /**
   * Start logo image loading and return a function that generates SVG logo markup.
   * Must be called before drawDots() so inLogoRange is set up.
   */
  private async drawLogo(): Promise<(() => string) | null> {
    let logo = this.options?.logo
    if (!logo) return null

    if (typeof logo === 'string') {
      logo = { src: logo }
    }
    return this._drawLogo(logo as Logo)
  }

  private async _drawLogo(logo: Logo): Promise<() => string> {
    const width = this.options.width || defaultOptions.width
    const coverLevel =
      ErrorCorrectionPercents[
        this.options.nodeQrCodeOptions?.errorCorrectionLevel || 'H'
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
      logoRadius = defaultOptions.logo.logoRadius,
      width: providedWidth,
      height: providedHeight,
    } = logo

    // Check if src is a data URL (for Node.js compatibility)
    const isDataUrl = src.startsWith('data:image')

    // Get image dimensions: use provided values for data URLs, or load image
    let imageWidth: number
    let imageHeight: number
    let logoDataUrl: string

    if (isDataUrl && providedWidth && providedHeight) {
      // Data URL with provided dimensions - skip loadImage (works in Node.js)
      imageWidth = providedWidth
      imageHeight = providedHeight
      logoDataUrl = src
    } else {
      // Need to load image to get dimensions
      const image = await loadImage(src, crossOrigin)
      imageWidth = image.width
      imageHeight = image.height

      // Convert to data URL for reliable SVG embedding
      if (isDataUrl) {
        logoDataUrl = src
      } else {
        try {
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = imageWidth
          tempCanvas.height = imageHeight
          const ctx = tempCanvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(image, 0, 0)
            logoDataUrl = tempCanvas.toDataURL('image/png')
          } else {
            logoDataUrl = src
          }
        } catch {
          logoDataUrl = src
        }
      }
    }

    const rate = imageWidth / imageHeight

    let logoWidth: number
    let logoHeight: number
    let logoInnerWidth: number
    let logoInnerHeight: number
    const maxHeight = Math.floor(
      Math.sqrt((this.dotSize * this.dotSize * maxHiddenDots) / rate)
    )

    if (rate > 1) {
      logoHeight = maxHeight
      logoInnerHeight = maxHeight - 2 * borderWidth
      logoInnerWidth = Math.floor(logoInnerHeight * rate)
      logoWidth = logoInnerWidth + borderWidth * 2
    } else {
      logoWidth = Math.floor(maxHeight * rate)
      logoInnerWidth = logoWidth - borderWidth * 2
      logoInnerHeight = Math.floor(logoInnerWidth / rate)
      logoHeight = logoInnerHeight + 2 * borderWidth
    }

    const xStart = (this.size - Math.ceil(logoWidth / this.dotSize)) / 2
    const xEnd = this.size - xStart - 1
    const yStart = (this.size - Math.ceil(logoHeight / this.dotSize)) / 2
    const yEnd = this.size - yStart - 1
    this.inLogoRange = (i: number, j: number) => {
      return i >= xStart && i <= xEnd && j >= yStart && j <= yEnd
    }

    // Return function that generates SVG for the logo
    return () => {
      const cx = width / 2
      const cy = width / 2
      const halfW = logoWidth / 2
      const halfH = logoHeight / 2
      const innerHalfW = logoInnerWidth / 2
      const innerHalfH = logoInnerHeight / 2
      const fillColor = normalizeColor(bgColor)

      let logoElements = ''

      // Background rect with border radius
      const bgPath = roundRectPath(
        -halfW,
        -halfH,
        logoWidth,
        logoHeight,
        [borderRadius, borderRadius, borderRadius, borderRadius]
      )
      logoElements += svgPath(bgPath, { fill: fillColor })

      // Logo image
      if (logoRadius > 0) {
        // Clip path for rounded logo corners
        const clipId = 'qr-logo-clip'
        const clipRect = roundRectPath(
          -innerHalfW,
          -innerHalfH,
          logoInnerWidth,
          logoInnerHeight,
          [logoRadius, logoRadius, logoRadius, logoRadius]
        )
        logoElements +=
          `<clipPath id="${clipId}">${svgPath(clipRect)}</clipPath>` +
          `<image href="${logoDataUrl}" x="${-innerHalfW}" y="${-innerHalfH}" width="${logoInnerWidth}" height="${logoInnerHeight}" clip-path="url(#${clipId})"/>`
      } else {
        logoElements += `<image href="${logoDataUrl}" x="${-innerHalfW}" y="${-innerHalfH}" width="${logoInnerWidth}" height="${logoInnerHeight}"/>`
      }

      return svgGroup(logoElements, {
        transform: `translate(${cx},${cy})`,
      })
    }
  }

  private drawDots(): string {
    const count = this.size
    const dotSize = this.dotSize
    const xBeginning = this.offset
    const yBeginning = this.offset

    const filterDots = (i: number, j: number) => {
      if (
        squareMask[i]?.[j] ||
        squareMask[i - count + 7]?.[j] ||
        squareMask[i]?.[j - count + 7]
      ) {
        return false
      }
      if (
        dotMask[i]?.[j] ||
        dotMask[i - count + 7]?.[j] ||
        dotMask[i]?.[j - count + 7]
      ) {
        return false
      }
      if (this.inLogoRange && this.inLogoRange(i, j)) return false
      return true
    }

    const dotColor =
      this.options.dotsOptions?.color ||
      this.options.nodeQrCodeOptions?.color?.dark ||
      defaultOptions.dotsOptions.color

    const dot = new SvgDot({
      type:
        this.options.dotsOptions?.type || defaultOptions.dotsOptions.type,
      dotSize,
      color: normalizeColor(dotColor),
    })

    let elements = ''
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        if (!filterDots(i, j)) continue
        if (!this.isDark(i, j)) continue

        elements += dot.draw(
          xBeginning + i * dotSize,
          yBeginning + j * dotSize,
          (xOffset: number, yOffset: number): boolean | null => {
            if (
              i + xOffset < 0 ||
              j + yOffset < 0 ||
              i + xOffset >= count ||
              j + yOffset >= count
            )
              return null
            if (!filterDots(i + xOffset, j + yOffset)) return null
            return this.isDark(i + xOffset, j + yOffset)
          },
          this,
          i,
          j
        )
      }
    }

    return elements
  }

  private drawCorners(): string {
    const { nodeQrCodeOptions } = this.options
    const count = this.size
    const dotSize = this.dotSize
    const xBeginning = this.offset
    const yBeginning = this.offset

    const cornerColor = normalizeColor(
      this.options.cornersOptions?.color ||
        nodeQrCodeOptions?.color?.dark ||
        defaultOptions.cornersOptions.color
    )

    const corner = new SvgCorner(
      this.options.cornersOptions?.type || defaultOptions.cornersOptions.type,
      cornerColor
    )

    let elements = ''
    const positions: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ]

    for (const [column, row] of positions) {
      const x = xBeginning + column * dotSize * (count - 7)
      const y = yBeginning + row * dotSize * (count - 7)

      elements += corner.draw({
        x,
        y,
        dotSize,
        radius: this.options.cornersOptions?.radius,
      })
    }

    return elements
  }
}
