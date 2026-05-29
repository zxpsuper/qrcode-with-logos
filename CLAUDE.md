# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test              # Run Jest tests with coverage
npm test -- -t "name" # Run a single test by name
npm run build         # Run tests, then build (webpack min + rollup + types)
npm run build:min     # Webpack UMD minified bundle → lib/qrcode-with-logos.min.js
npm run build:rollup  # Rollup ESM + CJS bundles → lib/qrcode-with-logos.{esm,common}.js
npm run build:type    # Generate type declarations → types/ (uses tsconfig.build.json)
npm start             # Parcel dev server for index.html demo
npm run docs:dev      # VitePress docs dev server
```

## Architecture

This is a QR code generation library that extends the `qrcode` npm package with logo embedding and dot/corner styling. Entry point: `src/index.ts`.

**Core rendering pipeline** (`QrCodeWithLogo` constructor → `_toCanvas()` → `_toImage()`):

1. `QRCanvas` (`src/core/QRCanvas.ts`) — orchestrates canvas rendering:
   - Uses `qrcode.create()` to generate raw QR matrix data
   - `init()` calls: `clear()` → `drawBackground()` → `drawLogo()` → `drawDots()` → `drawCorners()`
   - Logo positioning respects error correction capacity (max hidden dots calculated from level + size)
   - `squareMask`/`dotMask` matrices define the 3 corner finder patterns that dots skip
2. `QRDot` (`src/core/QRDot.ts`) — renders individual QR dots with 12 style types (square, rounded, dot, diamond, star, fluid, fluid-line, stripe, stripe-row, stripe-column, tile, dot-small)
3. `QRCorner` (`src/core/QRCorner.ts`) — renders the 3 corner finder patterns with 7 style types (square, rounded, circle, rounded-circle, circle-rounded, circle-star, circle-diamond)
4. `src/core/utils.ts` — `loadImage()`, `canvasRoundRect()`, `toImage()`, `saveImage()`, `getErrorCorrectionLevel()` (auto-selects H/Q/M based on content length)
5. `src/core/defaultOptions.ts` — default values (width: 380, dot type: square, corner type: square)

**Key types** (`src/core/types.ts`): `BaseOptions` is the top-level config. `DotType` and `CornerType` string unions define available styles. `Logo` can be a string URL or config object with `src`, `borderRadius`, `bgColor`, etc.

**Testing**: Jest with jsdom. Canvas/Image APIs are mocked in `src/__tests__/setup.ts`. Tests live in `src/__tests__/`.

## Workflow Rules

- **Every feature or bugfix requires unit tests.** Add or update tests in `src/__tests__/` alongside code changes. Run `npm test` to verify.
- **Every feature or bugfix requires docs update.** Update the corresponding files under `docs/` (VitePress) to reflect API changes, new options, or behavior changes.
