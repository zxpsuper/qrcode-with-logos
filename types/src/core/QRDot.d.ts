import { QRCanvas } from './QRCanvas';
import { BasicFigureDrawArgsCanvas, DrawDotArgsCanvas, DotType, DrawArgsCanvas, GetNeighbor, RotateFigureArgsCanvas } from './types';
type QRDotOptions = {
    context: CanvasRenderingContext2D;
    type: DotType;
    dotSize: number;
};
export default class QRDot {
    _context: CanvasRenderingContext2D;
    _type: DotType;
    dotSize: number;
    constructor(options: QRDotOptions);
    draw(x: number, y: number, getNeighbor: GetNeighbor, qrCanvas: QRCanvas, i: number, j: number): void;
    _drawSquare({ x, y, size, context }: DrawArgsCanvas): void;
    _basicSquare(args: BasicFigureDrawArgsCanvas): void;
    _drawDot(args: DrawArgsCanvas): void;
    _drawDotSmall(args: DrawArgsCanvas): void;
    _drawBasicDot(args: DrawDotArgsCanvas): void;
    _drawRounded({ x, y, size, context }: DrawArgsCanvas): void;
    _drawTile(args: DrawArgsCanvas): void;
    _drawDiamond(args: DrawArgsCanvas): void;
    _drawStar(args: DrawArgsCanvas): void;
    _drawFluidLine(args: DrawArgsCanvas): void;
    _drawFluid({ x, y, size, context, getNeighbor }: DrawArgsCanvas, line?: boolean): void;
    _drawStripeColumn(args: DrawArgsCanvas): void;
    _drawStripeRow(args: DrawArgsCanvas): void;
    _drawStripe({ x, y, size, context, qrCanvas, i, j }: DrawArgsCanvas, type?: 'row' | 'column' | 'default'): void;
    _rotateFigure({ x, y, size, context, rotation, draw }: RotateFigureArgsCanvas): void;
}
export {};
