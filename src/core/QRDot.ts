import {
  BasicFigureDrawArgsCanvas,
  DrawDotArgsCanvas,
  DotType,
  DrawArgsCanvas,
  GetNeighbor,
  RotateFigureArgsCanvas
} from './types'
import { canvasRoundRect } from './utils'

interface DotTypes {
  [key: string]: DotType
}

const dotTypes = {
  tile: 'tile',
  dot: 'dot',
  dotSmall: 'dot-small',
  rounded: 'rounded',
  square: 'square',
  diamond: 'diamond',
  star: 'star',
  fluid: 'fluid',
  fluidLine: 'fluid-line',
  stripe: 'stripe',
  stripeColumn: 'stripe-column'
} as DotTypes

type QRDotOptions = {
  context: CanvasRenderingContext2D
  type: DotType
  dotSize: number
}
export default class QRDot {
  _context: CanvasRenderingContext2D
  _type: DotType
  dotSize: number
  constructor(options: QRDotOptions) {
    this._context = options.context
    this._type = options.type
    this.dotSize = options.dotSize
  }

  draw(x: number, y: number, getNeighbor: GetNeighbor): void {
    const context = this._context
    const type = this._type
    let drawFunction
    switch (type) {
      case dotTypes.tile:
        drawFunction = this._drawTile
        break
      case dotTypes.dot:
        drawFunction = this._drawDot
        break
      case dotTypes.dotSmall:
        drawFunction = this._drawDotSmall
        break
      case dotTypes.rounded:
        drawFunction = this._drawRounded
        break
      case dotTypes.diamond:
        drawFunction = this._drawDiamond
        break
      case dotTypes.star:
        drawFunction = this._drawStar
        break
      case dotTypes.fluid:
        drawFunction = this._drawFluid
        break
      case dotTypes.fluidLine:
        drawFunction = this._drawFluidLine
        break
      case dotTypes.stripe:
        drawFunction = this._drawStripe
        break
      case dotTypes.stripeColumn:
        drawFunction = this._drawStripeColumn
        break
      case dotTypes.square:
      default:
        drawFunction = this._drawSquare
        break
    }

    drawFunction.call(this, { x, y, size: this.dotSize, context, getNeighbor })
  }

  _drawSquare({ x, y, size, context }: DrawArgsCanvas) {
    this._basicSquare({ x, y, size, context, rotation: 0 })
  }

  _basicSquare(args: BasicFigureDrawArgsCanvas) {
    const { size, context } = args

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size)
      }
    })
  }
  _drawDot(args: DrawArgsCanvas) {
    this._drawBasicDot(args)
  }
  _drawDotSmall(args: DrawArgsCanvas) {
    this._drawBasicDot({ ...args, dotRate: 0.3 })
  }
  _drawBasicDot(args: DrawDotArgsCanvas) {
    const { x, y, size, context, dotRate = 0.4 } = args
    const cx = x + size / 2
    const cy = y + size / 2
    context.beginPath()
    context.arc(cx, cy, size * dotRate, 0, Math.PI * 2)
    context.closePath()
    // 一次性填充会糊掉，一个个填则没有问题
    context.fill()
  }

  _drawRounded({ x, y, size, context }: DrawArgsCanvas) {
    size = 0.75 * size
    x += (1 / 8) * size
    y += (1 / 8) * size
    const cx = x + size / 2
    const cy = y + size / 2
    const originX = -size / 2
    context.translate(cx, cy)
    canvasRoundRect(context)(originX, originX, size,size, size / 4)
    context.fill()
    context.translate(-cx, -cy)
  }

  _drawTile(args: DrawArgsCanvas) {
    const { size, context } = args
    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size - 1, size - 1)
      }
    })
  }

  _drawDiamond(args: DrawArgsCanvas) {
    let { size, context } = args
    this._rotateFigure({
      ...args,
      rotation: Math.PI / 4,
      draw: () => {
        size = (0.5 * size) / Math.sin(Math.PI / 4)
        context.rect(-size / 2, -size / 2, size, size)
      }
    })
  }

  _drawStar(args: DrawArgsCanvas) {
    let { size, context } = args
    this._rotateFigure({
      ...args,
      rotation: Math.PI / 4,
      draw: () => {
        context.moveTo(-size / 2, -size / 2)
        context.quadraticCurveTo(0, 0, size / 2, -size / 2)
        context.quadraticCurveTo(0, 0, size / 2, size / 2)
        context.quadraticCurveTo(0, 0, -size / 2, size / 2)
        context.quadraticCurveTo(0, 0, -size / 2, -size / 2)
      }
    })
  }
  _drawFluidLine(args: DrawArgsCanvas) {
    this._drawFluid(args, true)
  }
  _drawFluid(
    { x, y, size, context, getNeighbor }: DrawArgsCanvas,
    line = false
  ) {
    let roundedCorners = [false, false, false, false] // top-left, top-right, bottom-right, bottom-left
    if (!getNeighbor(0, -1) && !getNeighbor(-1, 0)) roundedCorners[0] = true
    if (!getNeighbor(1, 0) && !getNeighbor(0, -1)) roundedCorners[1] = true
    if (!getNeighbor(0, 1) && !getNeighbor(1, 0)) roundedCorners[2] = true
    if (!getNeighbor(0, 1) && !getNeighbor(-1, 0)) roundedCorners[3] = true
    const cx = x + size / 2
    const cy = y + size / 2
    context.translate(cx, cy)
    context.beginPath()
    context.arc(0, 0, size / 2, 0, 2 * Math.PI, false)
    context.closePath()
    context.fill()
    if (!roundedCorners[0])
      context.fillRect(-size / 2, -size / 2, size / 2, size / 2)
    if (!roundedCorners[1]) context.fillRect(0, -size / 2, size / 2, size / 2)
    if (!roundedCorners[2]) context.fillRect(0, 0, size / 2, size / 2)
    if (!roundedCorners[3]) context.fillRect(-size / 2, 0, size / 2, size / 2)

    if (line) {
      const originLinWidth = context.lineWidth
      if (getNeighbor(-1, 1)) {
        context.beginPath()
        context.lineWidth = size / 4
        context.moveTo(0, 0)
        context.lineTo(-size, size)
        context.stroke()
        context.closePath()
      }
      if (getNeighbor(1, 1)) {
        context.beginPath()
        context.lineWidth = size / 4
        context.moveTo(0, 0)
        context.lineTo(size, size)
        context.stroke()
        context.closePath()
      }
      context.lineWidth = originLinWidth
    }
    context.translate(-cx, -cy)
  }

  _drawStripeColumn(args: DrawArgsCanvas) {
    this._drawStripe(args, 'column')
  }

  _drawStripe(
    { x, y, size, context, getNeighbor }: DrawArgsCanvas,
    type: 'row' | 'column' = 'row'
  ) {
    const cx = x + size / 2
    const cy = y + size / 2
    context.translate(cx, cy)
    context.beginPath()
    context.arc(0, 0, size / 4, 0, 2 * Math.PI, false)
    context.fill()
    context.closePath()
    if (type === 'row') {
      if (getNeighbor(-1, 0)) {
        context.fillRect(-size / 2, -size / 4, size / 2, size / 2)
      }
      if (getNeighbor(1, 0)) {
        context.fillRect(0, -size / 4, size / 2, size / 2)
      }
    } else if (type === 'column') {
      if (getNeighbor(0, -1)) {
        context.fillRect(-size / 4, -size / 2, size / 2, size / 2)
      }
      if (getNeighbor(0, 1)) {
        context.fillRect(-size / 4, 0, size / 2, size / 2)
      }
    }
    context.translate(-cx, -cy)
  }

  _rotateFigure({
    x,
    y,
    size,
    context,
    rotation = 0,
    draw
  }: RotateFigureArgsCanvas) {
    const cx = x + size / 2
    const cy = y + size / 2
    context.translate(cx, cy)
    rotation && context.rotate(rotation)
    draw()
    context.closePath()
    rotation && context.rotate(-rotation)
    context.translate(-cx, -cy)
  }
}
