import { CornerType, SvgCornerDrawArgs } from './types';
export default class SvgCorner {
    cornerType: CornerType;
    private _color;
    private drawMethodMap;
    constructor(cornerType: CornerType, color: string);
    draw(args: SvgCornerDrawArgs): string;
    private get fill();
    _drawSquare({ x, y, dotSize }: SvgCornerDrawArgs): string;
    _drawRounded({ x, y, dotSize, radius }: SvgCornerDrawArgs): string;
    _drawCircle({ x, y, dotSize }: SvgCornerDrawArgs): string;
    _drawRoundedCircle({ x, y, dotSize, radius }: SvgCornerDrawArgs): string;
    _drawCircleRounded({ x, y, dotSize, radius }: SvgCornerDrawArgs): string;
    _drawCircleDiamond({ x, y, dotSize }: SvgCornerDrawArgs): string;
    _drawCircleStar({ x, y, dotSize }: SvgCornerDrawArgs): string;
    private _drawBasicRounded;
    /**
     * Draw the outer circle of a corner.
     */
    private _drawOuterCircle;
    /**
     * Draw the inner circle of a corner.
     */
    private _drawInnerCircle;
    /**
     * Draw a rounded square (for outer frame or inner box).
     */
    private _drawRoundedSquare;
    /**
     * Draw the diamond inner shape for circle-diamond corner.
     */
    private _drawDiamondInner;
    /**
     * Draw the star inner shape for circle-star corner.
     */
    private _drawStarInner;
}
