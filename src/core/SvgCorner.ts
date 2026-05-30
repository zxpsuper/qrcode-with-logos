import { CornerType, SvgCornerDrawArgs } from './types'
import { svgCircle, svgPath, svgGroup, roundRectPath } from './svgUtils'

type SvgCornerMethod = (args: SvgCornerDrawArgs) => string

export default class SvgCorner {
  cornerType: CornerType
  private _color: string

  private drawMethodMap: Record<CornerType, SvgCornerMethod> = {
    square: (args) => this._drawSquare(args),
    rounded: (args) => this._drawRounded(args),
    circle: (args) => this._drawCircle(args),
    'rounded-circle': (args) => this._drawRoundedCircle(args),
    'circle-rounded': (args) => this._drawCircleRounded(args),
    'circle-diamond': (args) => this._drawCircleDiamond(args),
    'circle-star': (args) => this._drawCircleStar(args),
  }

  constructor(cornerType: CornerType, color: string) {
    this.cornerType = cornerType
    this._color = color
  }

  draw(args: SvgCornerDrawArgs): string {
    const drawFunction =
      this.drawMethodMap[this.cornerType] || this.drawMethodMap['square']
    return drawFunction(args)
  }

  private get fill(): string {
    return this._color
  }

  // ---- Square ----

  _drawSquare({ x, y, dotSize }: SvgCornerDrawArgs): string {
    return this._drawBasicRounded(x, y, dotSize, 0, 0)
  }

  // ---- Rounded ----

  _drawRounded({ x, y, dotSize, radius }: SvgCornerDrawArgs): string {
    const inner =
      typeof radius === 'number' ? radius : radius?.inner ?? dotSize / 4
    const outer =
      typeof radius === 'number' ? radius : radius?.outer ?? dotSize / 2
    return this._drawBasicRounded(x, y, dotSize, outer, inner)
  }

  // ---- Circle ----

  _drawCircle({ x, y, dotSize }: SvgCornerDrawArgs): string {
    return (
      this._drawOuterCircle(x, y, dotSize, false) +
      this._drawInnerCircle(x, y, dotSize, true)
    )
  }

  // ---- Rounded-Circle (rounded outer, circle inner) ----

  _drawRoundedCircle({ x, y, dotSize, radius }: SvgCornerDrawArgs): string {
    const outer =
      typeof radius === 'number' ? radius : radius?.outer ?? dotSize / 2
    return (
      this._drawRoundedSquare(x, y, dotSize, dotSize * 7, outer, false) +
      this._drawInnerCircle(x, y, dotSize, true)
    )
  }

  // ---- Circle-Rounded (circle outer, rounded inner) ----

  _drawCircleRounded({ x, y, dotSize, radius }: SvgCornerDrawArgs): string {
    const inner =
      typeof radius === 'number' ? radius : radius?.inner ?? dotSize / 4
    return (
      this._drawOuterCircle(x, y, dotSize, false) +
      this._drawRoundedSquare(
        x,
        y + 2 * dotSize,
        dotSize,
        dotSize * 3,
        inner,
        true,
        0
      )
    )
  }

  // ---- Circle-Diamond ----

  _drawCircleDiamond({ x, y, dotSize }: SvgCornerDrawArgs): string {
    return (
      this._drawOuterCircle(x, y, dotSize, false) +
      this._drawDiamondInner(x, y, dotSize)
    )
  }

  // ---- Circle-Star ----

  _drawCircleStar({ x, y, dotSize }: SvgCornerDrawArgs): string {
    return (
      this._drawOuterCircle(x, y, dotSize, false) +
      this._drawStarInner(x, y, dotSize)
    )
  }

  // ---- Shared helpers ----

  private _drawBasicRounded(
    x: number,
    y: number,
    dotSize: number,
    outerRadius: number,
    innerRadius: number
  ): string {
    const size = dotSize * 7
    return (
      this._drawRoundedSquare(x, y, dotSize, size, outerRadius, false) +
      this._drawRoundedSquare(
        x + 2 * dotSize,
        y + 2 * dotSize,
        dotSize,
        dotSize * 3,
        innerRadius,
        true
      )
    )
  }

  /**
   * Draw the outer circle of a corner.
   */
  private _drawOuterCircle(
    x: number,
    y: number,
    dotSize: number,
    fill: boolean
  ): string {
    const size = dotSize * 7
    const cx = x + size / 2
    const cy = y + size / 2
    const r = (size - dotSize) / 2
    const attrs: Record<string, string> = {
      fill: fill ? this.fill : 'none',
      stroke: this.fill,
      'stroke-width': String(dotSize),
    }
    return svgCircle(cx, cy, r, attrs)
  }

  /**
   * Draw the inner circle of a corner.
   */
  private _drawInnerCircle(
    x: number,
    y: number,
    dotSize: number,
    fill: boolean
  ): string {
    const innerSize = dotSize * 3
    const cx = x + 2 * dotSize + innerSize / 2
    const cy = y + 2 * dotSize + innerSize / 2
    const r = innerSize / 2
    const attrs: Record<string, string> = {
      fill: fill ? this.fill : 'none',
      stroke: this.fill,
      'stroke-width': String(dotSize),
    }
    return svgCircle(cx, cy, r, attrs)
  }

  /**
   * Draw a rounded square (for outer frame or inner box).
   */
  private _drawRoundedSquare(
    x: number,
    y: number,
    dotSize: number,
    size: number,
    radius: number | number[],
    fill: boolean,
    rotation = 0
  ): string {
    // Adjust so stroke aligns to edges
    const adjX = x + dotSize / 2
    const adjY = y + dotSize / 2
    const adjSize = size - dotSize

    if (!Array.isArray(radius)) {
      radius = [radius, radius, radius, radius]
    }
    radius = radius.map((r) => Math.min(r, adjSize / 2, Math.max(r, 0)))

    const cx = adjX + adjSize / 2
    const cy = adjY + adjSize / 2
    const originX = -adjSize / 2
    const originY = -adjSize / 2

    const d = roundRectPath(originX, originY, adjSize, adjSize, radius)
    const attrs: Record<string, string> = {
      fill: fill ? this.fill : 'none',
      stroke: this.fill,
      'stroke-width': String(dotSize),
    }
    let transform = `translate(${cx},${cy})`
    if (rotation) {
      transform += ` rotate(${(rotation * 180) / Math.PI})`
    }
    return svgGroup(svgPath(d, attrs), { transform })
  }

  /**
   * Draw the diamond inner shape for circle-diamond corner.
   */
  private _drawDiamondInner(
    x: number,
    y: number,
    dotSize: number
  ): string {
    const innerSize = dotSize * 3
    const cx = x + 2 * dotSize + innerSize / 2
    const cy = y + 2 * dotSize + innerSize / 2
    const half = innerSize / 2

    const d = `M${-half} ${-half}L${half} ${-half}L${half} ${half}L${-half} ${half}Z`
    return svgGroup(svgPath(d, { fill: this.fill }), {
      transform: `translate(${cx},${cy}) rotate(45)`,
    })
  }

  /**
   * Draw the star inner shape for circle-star corner.
   */
  private _drawStarInner(
    x: number,
    y: number,
    dotSize: number
  ): string {
    const innerSize = dotSize * 3
    const cx = x + 2 * dotSize + innerSize / 2
    const cy = y + 2 * dotSize + innerSize / 2
    const half = innerSize / 2

    const d =
      `M${-half} ${-half}` +
      `Q0 ${-half / 2} ${half} ${-half}` +
      `Q${half / 2} 0 ${half} ${half}` +
      `Q0 ${half / 2} ${-half} ${half}` +
      `Q${-half / 2} 0 ${-half} ${-half}Z`
    return svgPath(d, { fill: this.fill, transform: `translate(${cx},${cy})` })
  }
}
