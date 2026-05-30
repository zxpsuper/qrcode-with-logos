# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test              # Run Jest unit tests with coverage
npm test -- -t "name" # Run a single test by name
npm run build         # Run tests, then build (webpack min + rollup + types)
npm run build:min     # Webpack UMD minified bundle → lib/qrcode-with-logos.min.js
npm run build:rollup  # Rollup ESM + CJS bundles → lib/qrcode-with-logos.{esm,common}.js
npm run build:type    # Generate type declarations → types/ (uses tsconfig.build.json)
npm run test:e2e      # Build + run all e2e tests (browser + Node.js)
npm run test:e2e:node # Run Node.js e2e tests only
npm start             # Parcel dev server for index.html demo
npm run docs:dev      # VitePress docs dev server
```

## Architecture

This is a QR code generation library that extends the `qrcode` npm package with logo embedding and dot/corner styling. Entry point: `src/index.ts`.

**Two rendering modes**:
- **Canvas** (default): Uses browser canvas API to draw QR code
- **SVG**: Generates SVG string without canvas (works in Node.js)

**Core rendering pipeline**:

Canvas mode: `QrCodeWithLogo` constructor → `_toCanvas()` → `_toImage()`
SVG mode: `QrCodeWithLogo` constructor → `_toSvg()` → `getSvgString()`

**Core classes**:

1. `QRCanvas` (`src/core/QRCanvas.ts`) — orchestrates canvas rendering:
   - Uses `qrcode.create()` to generate raw QR matrix data
   - `init()` calls: `clear()` → `drawBackground()` → `drawLogo()` → `drawDots()` → `drawCorners()`
   - Logo positioning respects error correction capacity
   - `squareMask`/`dotMask` matrices define the 3 corner finder patterns

2. `QRSvg` (`src/core/QRSvg.ts`) — orchestrates SVG rendering:
   - Generates SVG string (no canvas dependency)
   - Works in Node.js without logo, or with base64 logo + explicit dimensions
   - Logo converted to base64 data URL for reliable SVG embedding

3. `QRDot` (`src/core/QRDot.ts`) — renders dots with 12 styles
4. `SvgDot` (`src/core/SvgDot.ts`) — SVG version of dots
5. `QRCorner` (`src/core/QRCorner.ts`) — renders corners with 7 styles
6. `SvgCorner` (`src/core/SvgCorner.ts`) — SVG version of corners

7. `src/core/utils.ts` — `loadImage()`, `canvasRoundRect()`, `toImage()`, `saveImage()`, `normalizeColor()`, `getErrorCorrectionLevel()`

8. `src/core/svgUtils.ts` — SVG helper functions: `wrapSvg()`, `svgRect()`, `svgPath()`, `svgGroup()`, `roundRectPath()`

9. `src/core/defaultOptions.ts` — defaults (width: 380, renderer: 'canvas', dot/corner type: square)

**Key types** (`src/core/types.ts`): 
- `BaseOptions` — top-level config including `renderer: 'canvas' | 'svg'`
- `Logo` — can be string URL or object with `src`, `width`, `height` (for Node.js base64 logos), `borderRadius`, etc.
- `DotType` / `CornerType` — style unions

**Version handling**: Uses `@rollup/plugin-replace` to inject version at build time. Source uses placeholder `'0.0.0'` which is replaced with actual version from package.json.

## Node.js Compatibility

| Bundle | Browser | Node.js |
|--------|---------|---------|
| CJS (`common.js`) | ✅ | ✅ |
| UMD (`min.js`) | ✅ | ✅ |
| ESM (`esm.js`) | ✅ | ❌ |

| Feature | Node.js Support |
|---------|-----------------|
| Canvas renderer | ❌ (requires browser APIs) |
| SVG renderer (no logo) | ✅ |
| SVG renderer + base64 logo + width/height | ✅ |
| SVG renderer + URL logo | ❌ (requires `new Image()`) |

## Testing

**Unit tests**: Jest with jsdom. Canvas/Image APIs mocked in `src/__tests__/setup.ts`.

**E2E tests**:
- `e2e/cjs.test.ts` — tests CJS bundle in jsdom
- `e2e/umd.test.ts` — tests UMD bundle in jsdom  
- `e2e/node.test.ts` — tests CJS bundle in Node.js environment
- `e2e/esm.test.mjs` — tests ESM bundle in browser-like environment

**Test counts**: 286 unit tests, 152 browser e2e tests, 17 Node.js e2e tests.

## Workflow Rules

- **Every feature or bugfix requires unit tests.** Add or update tests in `src/__tests__/` alongside code changes. Run `npm test` to verify.
- **Every feature or bugfix requires docs update.** Update the corresponding files under `docs/` (VitePress) to reflect API changes, new options, or behavior changes.
- **Run e2e tests before release.** Use `npm run test:e2e` to verify all bundles work correctly.
