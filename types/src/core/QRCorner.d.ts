import { CornerType } from './types';
export default class QRCorner {
    context: CanvasRenderingContext2D;
    cornerType: CornerType;
    color: string;
    constructor(context: CanvasRenderingContext2D, cornerType: CornerType, color: string);
    draw({ radius, x, y, cellSize }: {
        radius: any;
        x: any;
        y: any;
        cellSize: any;
    }): void;
    _drawRoundedCircle({ x, y, cellSize, radius }: {
        x: any;
        y: any;
        cellSize: any;
        radius: any;
    }): void;
    _drawCircleRounded({ x, y, cellSize, radius }: {
        x: any;
        y: any;
        cellSize: any;
        radius: any;
    }): void;
    _drawCircleDiamond({ x, y, cellSize }: {
        x: any;
        y: any;
        cellSize: any;
    }): void;
    _drawCircleStar({ x, y, cellSize }: {
        x: any;
        y: any;
        cellSize: any;
    }): void;
    _drawSquare({ x, y, cellSize }: {
        x: any;
        y: any;
        cellSize: any;
    }): void;
    _drawRounded({ x, y, cellSize, radius }: {
        x: any;
        y: any;
        cellSize: any;
        radius: any;
    }): void;
    _drawCircle({ x, y, cellSize }: {
        x: any;
        y: any;
        cellSize: any;
    }): void;
    _drawBasicRounded(x: any, y: any, cellSize: any, radius: any, rotation?: number): void;
    private drawCircle;
    private drawRoundedSquare;
    private drawInnerStar;
}
