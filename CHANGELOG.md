## v1.2.1

### Fixs

- **SVG circle-rounded corner:** Inner rectangle x-offset mismatch — missing `+ 2 * dotSize` caused leftward shift.
- **SVG circle / rounded-circle inner circle:** Radius too large — missing `- dotSize` stroke adjustment, now matches canvas output.
- **SVG download:** `_toSvg()` now renders SVG onto canvas and downloads as PNG when `download: true`.
- **SVG downloadImage():** Works in SVG mode — renders SVG to canvas then saves as PNG.
- **SVG logo in download:** Logo no longer blank — canvas-render approach bypasses SVG-in-img nested data URL security restriction.
- **QRDot rounded centering:** Offset computed from original dot size instead of shrunken size — dots now center within grid cell.
- **getNeighbor type safety:** Returns `false` instead of `null` for out-of-bounds/filtered cases, matching `boolean` return type.
- **Default option mutation:** Constructor uses spread (`{...this.defaultOption, ...options}`) instead of `Object.assign(this.defaultOption, options)` — prevents modifying shared defaults across instances.
- **Logo context isolation:** `_drawLogo` wrapper uses `context.save()`/`context.restore()` instead of manual translate compensation — prevents transform state leaks.
- **Test infrastructure:** Added `URL.createObjectURL`/`URL.revokeObjectURL` mocks for jsdom compatibility.

## v1.2.0

### Features

- **SVG Renderer:** New `renderer: 'svg'` option to generate QR code as SVG string instead of canvas.
- **Node.js Support:** SVG renderer works in Node.js environment without browser APIs.
- **API:** New `getSvgString()` method to get SVG output.
- **Types:** Improved TypeScript definitions with proper type exports.

### Tests

- **Unit Tests:** Comprehensive unit tests for QRCanvas, QRCorner, QRDot, and utility functions.
- **E2E Tests:** End-to-end tests for CJS, UMD, ESM bundles and Node.js environment.

### Improvements

- **Build:** Enhanced build configuration with better type generation.
- **Engine:** Node.js >=16.0.0 required.

## v1.1.1

### Features

- **style:** update dots style for `fluid-line` `stripe` `stripe-row` and `stripe-column`.

### Fixs

- **Promise reject:** `getCanvas` and `getImage` do not reject error.
- **options:** without cornerOptions will throw error, now it has default options.

## v1.1.0

### Features

- **style:** Set different color and type of dots and corners.
- **logo:** More normal aspect ratio of logo but no always 1:1.
- **logo:** Intelligent logo size.
- **canvas:** Faster drawing speed then before.
