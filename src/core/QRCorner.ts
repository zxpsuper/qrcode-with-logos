import {
  BasicCornerDrawArgs,
  CornerType,
  RotationCornerDrawArgs
} from './types'

type DrawMethod = (args: BasicCornerDrawArgs) => void

export default class QRCorner {
  context: CanvasRenderingContext2D
  cornerType: CornerType
  color: string

  private drawMethodMap: Record<CornerType, DrawMethod> = {
    'square': (args) => this._drawSquare(args),
    'rounded': (args) => this._drawRounded(args),
    'circle': (args) => this._drawCircle(args),
    'rounded-circle': (args) => this._drawRoundedCircle(args),
    'circle-rounded': (args) => this._drawCircleRounded(args),
    'circle-diamond': (args) => this._drawCircleDiamond(args),
    'circle-star': (args) => this._drawCircleStar(args)
  }

  constructor(
    context: CanvasRenderingContext2D,
    cornerType: CornerType,
    color: string
  ) {
    this.context = context
    this.cornerType = cornerType
    this.color = color
  }

  draw({ radius, x, y, dotSize }: BasicCornerDrawArgs) {
    const drawFunction = this.drawMethodMap[this.cornerType] || this.drawMethodMap['square']
    drawFunction({ x, y, radius, dotSize })
  }

  _drawRoundedCircle({ x, y, dotSize, radius }: BasicCornerDrawArgs) {
    const _radius: number =
      typeof radius === 'number' ? radius : radius?.outer || dotSize / 2
    this.drawRoundedSquare(dotSize, x, y, dotSize * 7, _radius, false, 0)
    this.drawCircle(
      dotSize,
      x + 2 * dotSize,
      y + 2 * dotSize,
      dotSize * 3,
      true
    )
  }

  _drawCircleRounded({ x, y, dotSize, radius }: BasicCornerDrawArgs) {
    this.drawCircle(dotSize, x, y, dotSize * 7, false)
    const _radius: number =
      typeof radius === 'number' ? radius : radius?.inner || dotSize / 4
    this.drawRoundedSquare(
      dotSize,
      x + 2 * dotSize,
      y + 2 * dotSize,
      dotSize * 3,
      _radius,
      true,
      0
    )
  }

  _drawCircleDiamond({ x, y, dotSize }: BasicCornerDrawArgs) {
    this.drawCircle(dotSize, x, y, dotSize * 7, false)
    this.drawRoundedSquare(
      dotSize,
      x + 2 * dotSize,
      y + 2 * dotSize,
      dotSize * 3,
      0,
      true,
      (45 * Math.PI) / 180
    )
  }

  _drawCircleStar({ x, y, dotSize }: BasicCornerDrawArgs) {
    this.drawCircle(dotSize, x, y, dotSize * 7, false)
    this.drawInnerStar(x + 2 * dotSize, y + 2 * dotSize, dotSize * 3)
  }

  _drawSquare({ x, y, dotSize }: BasicCornerDrawArgs) {
    return this._drawBasicRounded({ x, y, dotSize, radius: 0 })
  }

  _drawRounded({ x, y, dotSize, radius }: BasicCornerDrawArgs) {
    const inner =
      typeof radius === 'number' ? radius : radius?.inner || dotSize / 4
    const outer =
      typeof radius === 'number' ? radius : radius?.outer || dotSize / 2
    return this._drawBasicRounded({
      x,
      y,
      dotSize,
      radius: {
        inner,
        outer
      }
    })
  }

  _drawCircle({ x, y, dotSize }: BasicCornerDrawArgs) {
    this.drawCircle(dotSize, x, y, dotSize * 7, false)
    this.drawCircle(
      dotSize,
      x + 2 * dotSize,
      y + 2 * dotSize,
      dotSize * 3,
      true
    )
  }

  _drawBasicRounded({
    x,
    y,
    dotSize,
    radius,
    rotation = 0
  }: RotationCornerDrawArgs) {
    let radiusOuter: number
    let radiusInner: number
    if (typeof radius !== 'number') {
      radiusOuter = radius.outer || 0
      radiusInner = radius.inner || 0
    } else {
      radiusOuter = radius
      radiusInner = radiusOuter
    }

    let size = dotSize * 7
    // Outer box
    this.drawRoundedSquare(dotSize, x, y, size, radiusOuter, false, rotation)
    // Inner box
    size = dotSize * 3
    y += dotSize * 2
    x += dotSize * 2
    this.drawRoundedSquare(dotSize, x, y, size, radiusInner, true, rotation)
  }

  private drawCircle(
    dotSize: number,
    x: number,
    y: number,
    size: number,
    fill: boolean
  ) {
    const ctx = this.context
    const color = this.color
    ctx.save()
    ctx.lineWidth = dotSize
    ctx.fillStyle = color
    ctx.strokeStyle = color
    y += size / 2
    x += size / 2
    size -= dotSize
    ctx.beginPath()
    ctx.arc(x, y, size / 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
    ctx.restore()
  }

  private drawRoundedSquare(
    dotSize: number,
    x: number,
    y: number,
    size: number,
    radius: number | number[],
    fill: boolean,
    rotation: number
  ) {
    const ctx = this.context
    const color = this.color
    ctx.save()
    ctx.lineWidth = dotSize
    ctx.fillStyle = color
    ctx.strokeStyle = color
    // Adjust coordinates so that the outside of the stroke is aligned to the edges
    y += dotSize / 2
    x += dotSize / 2
    size -= dotSize
    if (!Array.isArray(radius)) {
      radius = [radius, radius, radius, radius]
    }
    // Radius should not be greater than half the size or less than zero
    radius = radius.map((r) => {
      r = Math.min(r, size / 2)
      return r < 0 ? 0 : r
    })
    const rTopLeft = radius[0] || 0
    const rTopRight = radius[1] || 0
    const rBottomRight = radius[2] || 0
    const rBottomLeft = radius[3] || 0
    ctx.beginPath()
    const cx = x + size / 2
    const cy = y + size / 2
    const originX = -size / 2
    ctx.translate(cx, cy)
    if (rotation) ctx.rotate(rotation)
    ctx.moveTo(originX + rTopLeft, originX)
    ctx.lineTo(originX + size - rTopRight, originX)
    if (rTopRight)
      ctx.quadraticCurveTo(
        originX + size,
        originX,
        originX + size,
        originX + rTopRight
      )

    ctx.lineTo(originX + size, originX + size - rBottomRight)
    if (rBottomRight)
      ctx.quadraticCurveTo(
        originX + size,
        originX + size,
        originX + size - rBottomRight,
        originX + size
      )
    ctx.lineTo(originX + rBottomLeft, originX + size)
    if (rBottomLeft)
      ctx.quadraticCurveTo(
        originX,
        originX + size,
        originX,
        originX + size - rBottomLeft
      )
    ctx.lineTo(originX, originX + rTopLeft)
    if (rTopLeft)
      ctx.quadraticCurveTo(originX, originX, originX + rTopLeft, originX)
    ctx.closePath()
    ctx.stroke()
    if (fill) {
      ctx.fill()
    }
    ctx.restore()
  }

  private drawInnerStar(x: number, y: number, size: number) {
    const context = this.context
    const cx = x + size / 2
    const cy = y + size / 2
    context.save()
    context.translate(cx, cy)
    context.beginPath()
    context.moveTo(-size / 2, -size / 2)
    context.quadraticCurveTo(0, -size / 4, size / 2, -size / 2)
    context.quadraticCurveTo(size / 4, 0, size / 2, size / 2)
    context.quadraticCurveTo(0, size / 4, -size / 2, size / 2)
    context.quadraticCurveTo(-size / 4, 0, -size / 2, -size / 2)
    context.closePath()
    context.fill()
    context.restore()
  }
}
