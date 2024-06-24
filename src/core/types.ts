export type DrawArgs = {
  x: number
  y: number
  size: number
  rotation?: number
  getNeighbor?: GetNeighbor
}

export type RotateFigureArgs = {
  x: number
  y: number
  size: number
  rotation?: number
  draw: () => void
}

export type BasicFigureDrawArgs = {
  x: number
  y: number
  size: number
  rotation?: number
}

export type GetNeighbor = (x: number, y: number) => boolean

export type DrawArgsCanvas = DrawArgs & {
  context: CanvasRenderingContext2D
}

export type DrawDotArgsCanvas = DrawArgsCanvas & {
  dotRate?: number
}

export type BasicFigureDrawArgsCanvas = BasicFigureDrawArgs & {
  context: CanvasRenderingContext2D
}

export type RotateFigureArgsCanvas = RotateFigureArgs & {
  context: CanvasRenderingContext2D
}

export type DotType =
  | 'dot'
  | 'dot-small'
  | 'tile'
  | 'rounded'
  | 'square'
  | 'diamond'
  | 'star'
  | 'fluid'
  | 'fluid-line'
  | 'stripe'
  | 'stripe-column'

export type CornerType =
  | 'square'
  | 'rounded'
  | 'circle'
  | 'rounded-circle'
  | 'circle-rounded'
  | 'circle-star'
  | 'circle-diamond'

export interface Logo {
  src: string
  logoRadius?: number
  logoSize?: number
  borderRadius?: number
  borderColor?: string
  borderSize?: number
  bgColor?: string
  crossOrigin?: string
  borderWidth?: number
}

export interface NodeQrCodeOptions {
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: string
  scale?: any
}

export interface BaseOptions {
  content: string
  width?: number
  nodeQrCodeOptions?: NodeQrCodeOptions
  logo?: Logo | string
  canvas?: HTMLCanvasElement
  image?: HTMLImageElement
  download?: boolean | Function
  downloadName?: string
  dotsOptions?: {
    type?: DotType
    color?: string
  }
  cornersOptions?: {
    type?: CornerType
    color?: string
    radius?:
      | number
      | {
          inner: number
          outer: number
        }
  }
}
