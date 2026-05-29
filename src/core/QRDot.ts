import { QRCanvas } from './QRCanvas'
import {
  BasicFigureDrawArgsCanvas,
  DrawDotArgsCanvas,
  DotType,
  DrawArgsCanvas,
  RotateFigureArgsCanvas
} from './types'
import { canvasRoundRect } from './utils'

type DrawMethod = (args: DrawArgsCanvas) => void

export default class QRDot {
  _context: CanvasRenderingContext2D
  _type: DotType
  dotSize: number

  private drawMethodMap: Record<DotType, DrawMethod> = {
    'tile': (args) => this._drawTile(args),
    'dot': (args) => this._drawDot(args),
    'dot-small': (args) => this._drawDotSmall(args),
    'rounded': (args) => this._drawRounded(args),
    'square': (args) => this._drawSquare(args),
    'diamond': (args) => this._drawDiamond(args),
    'star': (args) => this._drawStar(args),
    'fluid': (args) => this._drawFluid(args),
    'fluid-line': (args) => this._drawFluidLine(args),
    'stripe': (args) => this._drawStripe(args),
    'stripe-row': (args) => this._drawStripeRow(args),
    'stripe-column': (args) => this._drawStripeColumn(args)
  }

  constructor(options: { context: CanvasRenderingContext2D; type: DotType; dotSize: number }) {
    this._context = options.context
    this._type = options.type
    this.dotSize = options.dotSize
  }

  draw(
    x: number,
    y: number,
    getNeighbor: (offsetX: number, offsetY: number) => boolean | null,
    qrCanvas: QRCanvas,
    i: number,
    j: number
  ): void {
    const drawFunction = this.drawMethodMap[this._type] || this.drawMethodMap['square']
    drawFunction({
      x,
      y,
      size: this.dotSize,
      context: this._context,
      getNeighbor,
      qrCanvas,
      i,
      j
    })
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
    context.save()
    context.beginPath()
    context.arc(cx, cy, size * dotRate, 0, Math.PI * 2)
    context.closePath()
    context.fill()
    context.restore()
  }

  _drawRounded({ x, y, size, context }: DrawArgsCanvas) {
    size = 0.75 * size
    x += (1 / 8) * size
    y += (1 / 8) * size
    const cx = x + size / 2
    const cy = y + size / 2
    const originX = -size / 2
    context.save()
    context.translate(cx, cy)
    canvasRoundRect(context)(originX, originX, size, size, size / 4)
    context.fill()
    context.restore()
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

  _drawFluid({ x, y, size, context, getNeighbor }: DrawArgsCanvas, line = false) {
    const roundedCorners = [false, false, false, false] // top-left, top-right, bottom-right, bottom-left
    if (!getNeighbor(0, -1) && !getNeighbor(-1, 0)) roundedCorners[0] = true
    if (!getNeighbor(1, 0) && !getNeighbor(0, -1)) roundedCorners[1] = true
    if (!getNeighbor(0, 1) && !getNeighbor(1, 0)) roundedCorners[2] = true
    if (!getNeighbor(0, 1) && !getNeighbor(-1, 0)) roundedCorners[3] = true
    const cx = x + size / 2
    const cy = y + size / 2
    context.save()
    context.translate(cx, cy)
    context.beginPath()
    context.arc(0, 0, size / 2, 0, 2 * Math.PI, false)
    context.closePath()
    context.fill()
    if (!roundedCorners[0]) context.fillRect(-size / 2, -size / 2, size / 2, size / 2)
    if (!roundedCorners[1]) context.fillRect(0, -size / 2, size / 2, size / 2)
    if (!roundedCorners[2]) context.fillRect(0, 0, size / 2, size / 2)
    if (!roundedCorners[3]) context.fillRect(-size / 2, 0, size / 2, size / 2)

    if (line && !getNeighbor(0, 1)) {
      if (getNeighbor(-1, 1)) {
        context.beginPath()
        context.arc(-size, 0, size / 2, 0, 0.5 * Math.PI, false)
        context.arc(0, size, size / 2, Math.PI, 1.5 * Math.PI, false)
        context.closePath()
        context.stroke()
        context.fill()
      }
      if (getNeighbor(1, 1)) {
        context.beginPath()
        context.arc(size, 0, size / 2, 0.5 * Math.PI, Math.PI, false)
        context.arc(0, size, size / 2, 1.5 * Math.PI, 0, false)
        context.closePath()
        context.stroke()
        context.fill()
      }
    }
    context.restore()
  }

  _drawStripeColumn(args: DrawArgsCanvas) {
    return this._drawStripe(args, 'column')
  }

  _drawStripeRow(args: DrawArgsCanvas) {
    return this._drawStripe(args, 'row')
  }

  _drawStripe(
    { x, y, size, context, qrCanvas, i, j }: DrawArgsCanvas,
    type: 'row' | 'column' | 'default' = 'default'
  ) {
    const setRangeDisabled = (width: number, height: number) => {
      for (let i1 = i; i1 < i + width; i1++) {
        for (let j1 = j; j1 < j + height; j1++) {
          qrCanvas!.setDisabled(i1, j1)
        }
      }
    }

    const getRangeTrue = (width: number, height: number): boolean => {
      for (let i1 = i; i1 < i + width; i1++) {
        for (let j1 = j; j1 < j + height; j1++) {
          if (!qrCanvas!.isDark(i1, j1)) {
            return false
          }
        }
      }
      return true
    }

    const drawItem = (width: number, height: number) => {
      const cx = x + size / 2
      const cy = y + size / 2
      context.save()
      context.translate(cx, cy)
      context.beginPath()
      if (width === 1 && height === 1) {
        // 画圆点
        context.arc(0, 0, size / 4, 0, 2 * Math.PI, false)
      } else if (width > 1) {
        // 画横
        context.arc(0, 0, size / 4, 0.5 * Math.PI, 1.5 * Math.PI, false)
        context.arc(size * (width - 1), 0, size / 4, 1.5 * Math.PI, 0.5 * Math.PI, false)
      } else if (height > 1) {
        // 画竖
        context.arc(0, 0, size / 4, Math.PI, 2 * Math.PI, false)
        context.arc(0, size * (height - 1), size / 4, 0, Math.PI, false)
      }
      context.fill()
      context.closePath()
      context.restore()
      setRangeDisabled(width, height)
    }

    const array =
      type === 'row'
        ? [
            [3, 1],
            [2, 1],
            [1, 1]
          ]
        : type === 'column'
        ? [
            [1, 3],
            [1, 2],
            [1, 1]
          ]
        : [
            [3, 1],
            [1, 3],
            [2, 1],
            [1, 2],
            [1, 1]
          ]

    array.forEach((comb) => {
      if (getRangeTrue(comb[0], comb[1])) {
        drawItem(comb[0], comb[1])
      }
    })
  }

  _rotateFigure({ x, y, size, context, rotation = 0, draw }: RotateFigureArgsCanvas) {
    const cx = x + size / 2
    const cy = y + size / 2
    context.save()
    context.translate(cx, cy)
    if (rotation) context.rotate(rotation)
    draw()
    context.closePath()
    context.restore()
  }
}
