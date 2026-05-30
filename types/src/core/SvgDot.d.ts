import { DotType, SvgDrawArgs } from './types';
export default class SvgDot {
    _type: DotType;
    dotSize: number;
    private _color;
    private drawMethodMap;
    constructor(options: {
        type: DotType;
        dotSize: number;
        color: string;
    });
    draw(x: number, y: number, getNeighbor?: (offsetX: number, offsetY: number) => boolean | null, qrData?: any, i?: number, j?: number): string;
    private get fill();
    _drawSquare({ x, y, size }: SvgDrawArgs): string;
    private _basicSquare;
    _drawDot(args: SvgDrawArgs): string;
    _drawDotSmall(args: SvgDrawArgs): string;
    private _drawBasicDot;
    _drawRounded({ x, y, size }: SvgDrawArgs): string;
    _drawTile({ x, y, size }: SvgDrawArgs): string;
    _drawDiamond({ x, y, size }: SvgDrawArgs): string;
    _drawStar({ x, y, size }: SvgDrawArgs): string;
    _drawFluid(args: SvgDrawArgs, line?: boolean): string;
    _drawFluidLine(args: SvgDrawArgs): string;
    _drawStripeColumn(args: SvgDrawArgs): string;
    _drawStripeRow(args: SvgDrawArgs): string;
    _drawStripe({ x, y, size, qrData, i, j }: SvgDrawArgs, type?: 'row' | 'column' | 'default'): string;
    private _wrapTransform;
}
