import { BasicCornerDrawArgs, CornerType, RotationCornerDrawArgs } from './types';
export default class QRCorner {
    context: CanvasRenderingContext2D;
    cornerType: CornerType;
    color: string;
    constructor(context: CanvasRenderingContext2D, cornerType: CornerType, color: string);
    draw({ radius, x, y, dotSize }: BasicCornerDrawArgs): void;
    _drawRoundedCircle({ x, y, dotSize, radius }: BasicCornerDrawArgs): void;
    _drawCircleRounded({ x, y, dotSize, radius }: BasicCornerDrawArgs): void;
    _drawCircleDiamond({ x, y, dotSize }: BasicCornerDrawArgs): void;
    _drawCircleStar({ x, y, dotSize }: BasicCornerDrawArgs): void;
    _drawSquare({ x, y, dotSize }: BasicCornerDrawArgs): void;
    _drawRounded({ x, y, dotSize, radius }: BasicCornerDrawArgs): void;
    _drawCircle({ x, y, dotSize }: BasicCornerDrawArgs): void;
    _drawBasicRounded({ x, y, dotSize, radius, rotation }: RotationCornerDrawArgs): void;
    private drawCircle;
    private drawRoundedSquare;
    private drawInnerStar;
}
