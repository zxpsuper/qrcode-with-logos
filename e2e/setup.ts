// E2E test setup — mocks browser APIs (canvas, Image, DOM) for jsdom
// Does NOT mock 'qrcode' or 'QRCanvas' — e2e tests use the real libraries.

const mockCanvasContext: Record<string, any> = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fill: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  scale: jest.fn(),
  arc: jest.fn(),
  arcTo: jest.fn(),
  rect: jest.fn(),
  quadraticCurveTo: jest.fn(),
  createPattern: jest.fn(() => ({})),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  font: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'butt' as CanvasLineCap,
  lineJoin: 'miter' as CanvasLineJoin,
  miterLimit: 10,
  lineDashOffset: 0,
  shadowBlur: 0,
  shadowColor: 'rgba(0, 0, 0, 0)',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  globalAlpha: 1,
  globalCompositeOperation: 'source-over' as GlobalCompositeOperation,
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCanvasContext) as any;
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,test');

// Preserve jsdom's setAttribute
const _origSetAttr = Element.prototype.setAttribute;
if (typeof _origSetAttr === 'function') {
  HTMLCanvasElement.prototype.setAttribute = _origSetAttr;
} else {
  HTMLCanvasElement.prototype.setAttribute = jest.fn();
}

// Mock Image — fires onload asynchronously
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private _src: string = '';
  width: number = 100;
  height: number = 100;
  crossOrigin: string = '';

  get src() {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
    if (value) {
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 0);
    }
  }

  setAttribute(name: string, value: string) {
    if (name === 'crossOrigin') {
      this.crossOrigin = value;
    }
  }
}

(global as any).Image = MockImage;

// Mock MouseEvent
(global as any).MouseEvent = class MouseEvent {
  constructor(type: string, _options?: any) {}
};

// Mock document.body methods
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

// Prevent Node.js 20+ from crashing Jest worker on expected unhandled rejections.
// The library's constructor rejects canvasPromise/imagePromise synchronously when
// QRCode.create() throws (e.g. empty content). Test code attaches .catch() handlers
// immediately after construction, but the rejection already happened.
process.on('unhandledRejection', () => {});
