import { DotType, SvgDrawArgs } from './types'
import { svgCircle, svgRect, svgPath, svgGroup, roundRectPath } from './svgUtils'

type SvgDrawMethod = (args: SvgDrawArgs) => string

export default class SvgDot {
  _type: DotType
  dotSize: number
  private _color: string

  private drawMethodMap: Record<DotType, SvgDrawMethod> = {
    tile: (args) => this._drawTile(args),
    dot: (args) => this._drawDot(args),
    'dot-small': (args) => this._drawDotSmall(args),
    rounded: (args) => this._drawRounded(args),
    square: (args) => this._drawSquare(args),
    diamond: (args) => this._drawDiamond(args),
    star: (args) => this._drawStar(args),
    fluid: (args) => this._drawFluid(args),
    'fluid-line': (args) => this._drawFluidLine(args),
    stripe: (args) => this._drawStripe(args),
    'stripe-row': (args) => this._drawStripeRow(args),
    'stripe-column': (args) => this._drawStripeColumn(args),
  }

  constructor(options: { type: DotType; dotSize: number; color: string }) {
    this._type = options.type
    this.dotSize = options.dotSize
    this._color = options.color
  }

  draw(
    x: number,
    y: number,
    getNeighbor?: (offsetX: number, offsetY: number) => boolean | null,
    qrData?: any,
    i?: number,
    j?: number
  ): string {
    const drawFunction =
      this.drawMethodMap[this._type] || this.drawMethodMap['square']
    return drawFunction({
      x,
      y,
      size: this.dotSize,
      getNeighbor,
      qrData,
      i,
      j,
    })
  }

  private get fill(): string {
    return this._color
  }

  // ---- Square ----

  _drawSquare({ x, y, size }: SvgDrawArgs): string {
    return this._basicSquare(x, y, size, 0)
  }

  private _basicSquare(
    x: number,
    y: number,
    size: number,
    rotation: number
  ): string {
    const cx = x + size / 2
    const cy = y + size / 2
    const half = size / 2
    const el = svgRect(-half, -half, size, size, { fill: this.fill })
    return this._wrapTransform(el, cx, cy, rotation)
  }

  // ---- Dot / Dot-small ----

  _drawDot(args: SvgDrawArgs): string {
    return this._drawBasicDot(args, 0.4)
  }

  _drawDotSmall(args: SvgDrawArgs): string {
    return this._drawBasicDot(args, 0.3)
  }

  private _drawBasicDot({ x, y, size }: SvgDrawArgs, rate: number): string {
    const cx = x + size / 2
    const cy = y + size / 2
    return svgCircle(cx, cy, size * rate, { fill: this.fill })
  }

  // ---- Rounded ----

  _drawRounded({ x, y, size }: SvgDrawArgs): string {
    const origSize = size
    size = 0.75 * origSize
    const offset = (1 / 8) * size
    const cx = x + offset + size / 2
    const cy = y + offset + size / 2
    const half = size / 2
    const d = roundRectPath(-half, -half, size, size, [size / 4, size / 4, size / 4, size / 4])
    return this._wrapTransform(svgPath(d, { fill: this.fill }), cx, cy, 0)
  }

  // ---- Tile ----

  _drawTile({ x, y, size }: SvgDrawArgs): string {
    return this._basicSquare(x, y, size - 1, 0)
  }

  // ---- Diamond ----

  _drawDiamond({ x, y, size }: SvgDrawArgs): string {
    const rotatedSize = (0.5 * size) / Math.sin(Math.PI / 4)
    return this._basicSquare(x, y, rotatedSize, Math.PI / 4)
  }

  // ---- Star ----

  _drawStar({ x, y, size }: SvgDrawArgs): string {
    const cx = x + size / 2
    const cy = y + size / 2
    const half = size / 2
    const d =
      `M${-half} ${-half}` +
      `Q0 0 ${half} ${-half}` +
      `Q0 0 ${half} ${half}` +
      `Q0 0 ${-half} ${half}` +
      `Q0 0 ${-half} ${-half}Z`
    return this._wrapTransform(svgPath(d, { fill: this.fill }), cx, cy, Math.PI / 4)
  }

  // ---- Fluid / Fluid-line ----

  _drawFluid(args: SvgDrawArgs, line = false): string {
    const { x, y, size, getNeighbor } = args
    const cx = x + size / 2
    const cy = y + size / 2
    const half = size / 2
    const r = size / 2

    const roundedCorners = [false, false, false, false]
    if (!getNeighbor?.(0, -1) && !getNeighbor?.(-1, 0)) roundedCorners[0] = true
    if (!getNeighbor?.(1, 0) && !getNeighbor?.(0, -1)) roundedCorners[1] = true
    if (!getNeighbor?.(0, 1) && !getNeighbor?.(1, 0)) roundedCorners[2] = true
    if (!getNeighbor?.(0, 1) && !getNeighbor?.(-1, 0)) roundedCorners[3] = true

    // Circle at center
    let elements = svgCircle(0, 0, r, { fill: this.fill })

    // Corner fills
    if (!roundedCorners[0]) elements += svgRect(-half, -half, half, half, { fill: this.fill })
    if (!roundedCorners[1]) elements += svgRect(0, -half, half, half, { fill: this.fill })
    if (!roundedCorners[2]) elements += svgRect(0, 0, half, half, { fill: this.fill })
    if (!roundedCorners[3]) elements += svgRect(-half, 0, half, half, { fill: this.fill })

    if (line) {
      const r2 = size / 4
      if (!getNeighbor?.(0, 1)) {
        if (getNeighbor?.(-1, 1)) {
          // Arc from (-size, 0) to (0, size) forming an L-corner
          const d1 = `M${-size} 0A${r2} ${r2} 0 0 1 ${-size} ${r2}A${r2} ${r2} 0 0 1 ${-size + r2} ${size}A${r2} ${r2} 0 0 1 0 ${size}`
          elements += svgPath(d1, { fill: this.fill })
        }
        if (getNeighbor?.(1, 1)) {
          const d2 = `M${size} 0A${r2} ${r2} 0 0 0 ${size} ${r2}A${r2} ${r2} 0 0 0 ${size - r2} ${size}A${r2} ${r2} 0 0 0 0 ${size}`
          elements += svgPath(d2, { fill: this.fill })
        }
      }
    }

    return svgGroup(elements, { transform: `translate(${cx},${cy})`, fill: this.fill })
  }

  _drawFluidLine(args: SvgDrawArgs): string {
    return this._drawFluid(args, true)
  }

  // ---- Stripe variants ----

  _drawStripeColumn(args: SvgDrawArgs): string {
    return this._drawStripe(args, 'column')
  }

  _drawStripeRow(args: SvgDrawArgs): string {
    return this._drawStripe(args, 'row')
  }

  _drawStripe(
    { x, y, size, qrData, i = 0, j = 0 }: SvgDrawArgs,
    type: 'row' | 'column' | 'default' = 'default'
  ): string {
    const setRangeDisabled = (width: number, height: number) => {
      for (let i1 = i; i1 < i + width; i1++) {
        for (let j1 = j; j1 < j + height; j1++) {
          qrData?.setDisabled(i1, j1)
        }
      }
    }

    const getRangeTrue = (width: number, height: number): boolean => {
      for (let i1 = i; i1 < i + width; i1++) {
        for (let j1 = j; j1 < j + height; j1++) {
          if (!qrData?.isDark(i1, j1)) return false
        }
      }
      return true
    }

    const r = size / 4

    const drawItem = (width: number, height: number): string => {
      const cx = x + size / 2
      const cy = y + size / 2
      setRangeDisabled(width, height)

      if (width === 1 && height === 1) {
        return svgCircle(cx, cy, r, { fill: this.fill })
      }

      let d = ''
      if (width > 1) {
        // Horizontal pill
        const w = size * (width - 1)
        d = `M0 ${r}A${r} ${r} 0 0 1 0 ${-r}L${w} ${-r}A${r} ${r} 0 0 1 ${w} ${r}Z`
      } else if (height > 1) {
        // Vertical pill
        const h = size * (height - 1)
        d = `M${-r} 0A${r} ${r} 0 0 1 ${r} 0L${r} ${h}A${r} ${r} 0 0 1 ${-r} ${h}Z`
      }

      if (!d) return ''
      return svgGroup(svgPath(d, { fill: this.fill }), {
        transform: `translate(${cx},${cy})`,
      })
    }

    const combinations =
      type === 'row'
        ? [[3, 1] as const, [2, 1] as const, [1, 1] as const]
        : type === 'column'
        ? [[1, 3] as const, [1, 2] as const, [1, 1] as const]
        : ([[3, 1] as const, [1, 3] as const, [2, 1] as const, [1, 2] as const, [1, 1] as const])

    let result = ''
    for (const [w, h] of combinations) {
      if (getRangeTrue(w, h)) {
        result += drawItem(w, h)
        break
      }
    }
    return result
  }

  // ---- Helpers ----

  private _wrapTransform(
    element: string,
    cx: number,
    cy: number,
    rotation: number
  ): string {
    let transform = `translate(${cx},${cy})`
    if (rotation) {
      const deg = (rotation * 180) / Math.PI
      transform += ` rotate(${deg})`
    }
    return svgGroup(element, { transform })
  }
}
