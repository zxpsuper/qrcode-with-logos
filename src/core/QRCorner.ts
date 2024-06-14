import { CornerType } from './types'

interface CornerTypes {
  [key: string]: CornerType
}

const cornerTypes = {
  square: 'square',
  rounded: 'rounded',
  circle: 'circle',
  roundedCircle: 'rounded-circle',
  circleRounded: 'circle-rounded',
  circleDiamond: 'circle-diamond',
  circleStar: 'circle-star'
} as CornerTypes

export default class QRCorner {
  constructor(
    public context: CanvasRenderingContext2D,
    public cornerType: CornerType,
    public color: string
  ) {}

  draw({ radius, x, y, cellSize }) {
    let drawFunction
    switch (this.cornerType) {
      case cornerTypes.circle:
        drawFunction = this._drawCircle
        break
      case cornerTypes.rounded:
        drawFunction = this._drawRounded
        break
      case cornerTypes.roundedCircle:
        drawFunction = this._drawRoundedCircle
        break
      case cornerTypes.circleRounded:
        drawFunction = this._drawCircleRounded
        break
      case cornerTypes.circleDiamond:
        drawFunction = this._drawCircleDiamond
        break
      case cornerTypes.circleStar:
        drawFunction = this._drawCircleStar
        break
      case cornerTypes.square:
      default:
        drawFunction = this._drawSquare
        break
    }

    drawFunction.call(this, { x, y, radius, cellSize })
  }

  _drawRoundedCircle({ x, y, cellSize, radius }) {
    radius = radius?.outer || radius || cellSize / 2
    this.drawRoundedSquare(cellSize, x, y, cellSize * 7, radius, false, 0)
    this.drawCircle(
      cellSize,
      x + 2 * cellSize,
      y + 2 * cellSize,
      cellSize * 3,
      true
    )
  }

  _drawCircleRounded({ x, y, cellSize, radius }) {
    this.drawCircle(cellSize, x, y, cellSize * 7, false)
    radius = radius?.inner || radius || cellSize / 4
    this.drawRoundedSquare(
      cellSize,
      x + 2 * cellSize,
      y + 2 * cellSize,
      cellSize * 3,
      radius,
      true,
      0
    )
  }

  _drawCircleDiamond({ x, y, cellSize }) {
    this.drawCircle(cellSize, x, y, cellSize * 7, false)
    this.drawRoundedSquare(
      cellSize,
      x + 2 * cellSize,
      y + 2 * cellSize,
      cellSize * 3,
      0,
      true,
      (45 * Math.PI) / 180
    )
  }

  _drawCircleStar({ x, y, cellSize }) {
    this.drawCircle(cellSize, x, y, cellSize * 7, false)
    this.drawInnerStar(x + 2 * cellSize, y + 2 * cellSize, cellSize * 3)
  }

  _drawSquare({ x, y, cellSize }) {
    return this._drawBasicRounded(x, y, cellSize, 0)
  }

  _drawRounded({ x, y, cellSize, radius }) {
    return this._drawBasicRounded(x, y, cellSize, {
      inner: radius?.inner || cellSize / 4,
      outer: radius?.outer || cellSize / 2
    })
  }

  _drawCircle({ x, y, cellSize }) {
    this.drawCircle(cellSize, x, y, cellSize * 7, false)
    this.drawCircle(
      cellSize,
      x + 2 * cellSize,
      y + 2 * cellSize,
      cellSize * 3,
      true
    )
  }

  _drawBasicRounded(x, y, cellSize, radius, rotation = 0) {
    const lineWidth = Math.ceil(cellSize)
    let radiusOuter
    let radiusInner
    if (typeof radius !== 'number') {
      radiusOuter = radius.outer || 0
      radiusInner = radius.inner || 0
    } else {
      radiusOuter = radius
      radiusInner = radiusOuter
    }

    let size = cellSize * 7
    // Outer box
    this.drawRoundedSquare(lineWidth, x, y, size, radiusOuter, false, rotation)
    // Inner box
    size = cellSize * 3
    y += cellSize * 2
    x += cellSize * 2
    this.drawRoundedSquare(lineWidth, x, y, size, radiusInner, true, rotation)
  }

  private drawCircle(
    lineWidth: number,
    x: number,
    y: number,
    size: number,
    fill: boolean
  ) {
    const ctx = this.context
    const color = this.color
    ctx.lineWidth = lineWidth
    ctx.fillStyle = color
    ctx.strokeStyle = color
    y += size / 2
    x += size / 2
    size -= lineWidth
    ctx.beginPath()
    ctx.arc(x, y, size / 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
  }

  private drawRoundedSquare(
    lineWidth: number,
    x: number,
    y: number,
    size: number,
    radius: number | number[],
    fill: boolean,
    rotation: number
  ) {
    const ctx = this.context
    const color = this.color
    ctx.lineWidth = lineWidth
    ctx.fillStyle = color
    ctx.strokeStyle = color
    // Adjust coordinates so that the outside of the stroke is aligned to the edges
    y += lineWidth / 2
    x += lineWidth / 2
    size -= lineWidth
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
    rotation && ctx.rotate(rotation)
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
    rotation && ctx.rotate(-rotation)
    ctx.translate(-cx, -cy)
  }

  private drawInnerStar(x: number, y: number, size: number) {
    const context = this.context
    const cx = x + size / 2
    const cy = y + size / 2
    context.translate(cx, cy)
    context.beginPath()
    context.moveTo(-size / 2, -size / 2)
    context.quadraticCurveTo(0, -size / 4, size / 2, -size / 2)
    context.quadraticCurveTo(size / 4, 0, size / 2, size / 2)
    context.quadraticCurveTo(0, size / 4, -size / 2, size / 2)
    context.quadraticCurveTo(-size / 4, 0, -size / 2, -size / 2)
    context.closePath()
    context.fill()
    context.translate(-cx, -cy)
  }
}
