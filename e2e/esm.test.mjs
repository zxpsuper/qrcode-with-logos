// Standalone ESM bundle smoke test.
// The ESM bundle (lib/qrcode-with-logos.esm.js) uses native `import` for qrcode
// but also has `require('../package.json')` for the version string. This means
// it can't be loaded as either pure ESM or pure CJS in Node.js standalone — it
// relies on bundlers to resolve the mixed syntax.
//
// Our approach: copy the bundle to a temp .mjs file, patch the `require` call
// with the actual version, then `import()` it natively. This verifies the bundle
// content is valid and works when consumed by ESM-aware tooling.

import { createRequire } from 'module';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require_ = createRequire(import.meta.url);
const { JSDOM } = require_('jsdom');

// Read the real version from package.json
const pkg = require_(join(__dirname, '..', 'package.json'));
const actualVersion = pkg.version;

// Read and patch the ESM bundle: replace the require('../package.json') call
// with the actual version literal so it works in pure ESM context.
const bundlePath = join(__dirname, '..', 'lib', 'qrcode-with-logos.esm.js');
const tmpPath = join(__dirname, '..', 'lib', 'qrcode-with-logos.esm.test.mjs');
let bundle = readFileSync(bundlePath, 'utf8');

// Remove the require('../package.json') call and replace with version literal
bundle = bundle.replace(
  /(?:\/\/.*\n)?\s*var pkg = require\(['"]\.\.\/package\.json['"]\);\s*\n\s*var version = pkg\.version;\s*/,
  `var version = '${actualVersion}';\n`
);

writeFileSync(tmpPath, bundle);

// ---- Setup jsdom ----
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});
globalThis.document = dom.window.document;
globalThis.window = dom.window;
globalThis.navigator = dom.window.navigator;
globalThis.HTMLCanvasElement = dom.window.HTMLCanvasElement;
globalThis.HTMLImageElement = dom.window.HTMLImageElement;
globalThis.HTMLAnchorElement = dom.window.HTMLAnchorElement;
globalThis.Element = dom.window.Element;
globalThis.MouseEvent = dom.window.MouseEvent;

// Suppress expected unhandled rejections
process.on('unhandledRejection', () => {});

// Mock canvas 2D context
const mockCanvasContext = {
  fillRect: () => {},
  clearRect: () => {},
  getImageData: () => ({ data: new Array(4) }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  fill: () => {},
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  rotate: () => {},
  scale: () => {},
  arc: () => {},
  arcTo: () => {},
  rect: () => {},
  quadraticCurveTo: () => {},
  createPattern: () => ({}),
  measureText: () => ({ width: 0 }),
  transform: () => {},
  font: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  miterLimit: 10,
  lineDashOffset: 0,
  shadowBlur: 0,
  shadowColor: 'rgba(0, 0, 0, 0)',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
};

HTMLCanvasElement.prototype.getContext = () => mockCanvasContext;
HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,test';

// Mock Image
class MockImage {
  onload = null;
  onerror = null;
  _src = '';
  width = 100;
  height = 100;
  crossOrigin = '';

  get src() {
    return this._src;
  }

  set src(value) {
    this._src = value;
    if (value) {
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
  }

  setAttribute(name, value) {
    if (name === 'crossOrigin') this.crossOrigin = value;
  }
}

globalThis.Image = MockImage;

// Mock document.body methods
document.body.appendChild = () => {};
document.body.removeChild = () => {};

// ---- Import the patched ESM bundle ----
const { default: QrCodeWithLogo } = await import(pathToFileURL(tmpPath).href);

// Clean up temp file
try { unlinkSync(tmpPath); } catch {}

// ---- Results tracking ----
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

// ---- Tests ----
console.log('\nESM bundle smoke tests:\n');

// Version
assert(typeof QrCodeWithLogo.version === 'string', 'version is a string');
assert(/^\d+\.\d+\.\d+/.test(QrCodeWithLogo.version), 'version is semver');

// Basic construction
const instance = new QrCodeWithLogo({ content: 'hello' });
assert(instance !== undefined, 'instance is defined');
assert(instance.options.content === 'hello', 'content is set');
assert(instance.options.width === 380, 'default width is 380');

// Canvas
const canvas = await instance.getCanvas();
assert(canvas !== undefined, 'getCanvas() returns a value');
assert(canvas instanceof HTMLCanvasElement, 'getCanvas() returns HTMLCanvasElement');
assert(canvas.width === 380, 'canvas width is 380');
assert(canvas.height === 380, 'canvas height is 380');
assert(instance.ifCanvasDrawn === true, 'ifCanvasDrawn is true after draw');

// Image
const image = await instance.getImage();
assert(image !== undefined, 'getImage() returns a value');
assert(image instanceof HTMLImageElement, 'getImage() returns HTMLImageElement');
assert(image.src.startsWith('data:image/'), 'image src is a data URL');
assert(instance.ifImageCreated === true, 'ifImageCreated is true after image creation');

// Custom options
const custom = new QrCodeWithLogo({
  content: 'custom',
  width: 500,
  dotsOptions: { type: 'dot', color: '#ff0000' },
  cornersOptions: { type: 'rounded', color: '#00ff00' },
});
const customCanvas = await custom.getCanvas();
assert(customCanvas.width === 500, 'custom width applied');
assert(custom.ifCanvasDrawn === true, 'custom instance drawn');

// Logo as string
const logoStr = new QrCodeWithLogo({
  content: 'logo test',
  logo: 'https://example.com/logo.png',
});
await logoStr.getCanvas();
assert(logoStr.ifCanvasDrawn === true, 'logo as string works');

// Logo as object
const logoObj = new QrCodeWithLogo({
  content: 'logo test',
  logo: { src: 'https://example.com/logo.png', borderRadius: 10 },
});
await logoObj.getCanvas();
assert(logoObj.ifCanvasDrawn === true, 'logo as object works');

// Error handling
const errInstance = new QrCodeWithLogo({ content: '' });
try {
  await errInstance.getCanvas();
  assert(false, 'getCanvas() should reject on error');
} catch {
  assert(true, 'getCanvas() rejects on error');
}
assert(errInstance.ifCanvasDrawn === false, 'ifCanvasDrawn remains false on error');
assert(errInstance.ifImageCreated === false, 'ifImageCreated remains false on error');

// Deprecated methods
try {
  instance.toCanvas();
  assert(false, 'toCanvas() should throw');
} catch (e) {
  assert(e.message === 'toCanvas has been Deprecated!', 'toCanvas() throws deprecation');
}

try {
  instance.toImage();
  assert(false, 'toImage() should throw');
} catch (e) {
  assert(e.message === 'toImage has been Deprecated!', 'toImage() throws deprecation');
}

// ---- Summary ----
console.log(`\nESM bundle: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
