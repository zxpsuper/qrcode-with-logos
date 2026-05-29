# AGENTS.md

## Commands

```bash
npm test                    # Jest with coverage (jsdom environment)
npm test -- -t "test name"  # Single test by name
npm run build               # Tests + webpack UMD + rollup ESM/CJS
npm run build:min           # Webpack UMD only → lib/qrcode-with-logos.min.js
npm run build:rollup        # Rollup ESM + CJS → lib/qrcode-with-logos.{esm,common}.js
npm run build:type          # Type declarations → types/
npm start                   # Parcel dev server (demo page)
npm run docs:dev            # VitePress docs
```

No lint or typecheck scripts exist. No CI workflows. Run `npm test` before committing.

## Architecture

Single-package QR code library. Entry: `src/index.ts`. Only runtime dependency: `qrcode`.

Rendering pipeline: `QrCodeWithLogo` constructor → `_toCanvas()` → `_toImage()`.
- `QRCanvas` orchestrates: `clear()` → `drawBackground()` → `drawLogo()` → `drawDots()` → `drawCorners()`
- `QRDot` renders dots (12 styles), `QRCorner` renders corner patterns (7 styles)
- `utils.ts`: `loadImage()`, `canvasRoundRect()`, `toImage()`, `saveImage()`, `getErrorCorrectionLevel()`

Build outputs: webpack bundles UMD (minified), rollup bundles ESM+CJS. Both use `src/index.ts` as entry.

## Testing

- **Environment**: jsdom. Canvas/Image APIs fully mocked in `src/__tests__/setup.ts`.
- **Mock package.json**: `src/__tests__/mocks/package.json` provides minimal `{name, version}` for `require('../package.json')` in `index.ts`.
- **Coverage exclusions**: `src/server.ts`, `src/core/types.ts` (type-only file).
- **index.test.ts mocks QRCanvas**: The `QrCodeWithLogo` tests mock `../core/QRCanvas` to avoid jsdom's `canvas.setAttribute` issue. This means `_toCanvas`/`_toImage` bodies aren't directly tested there — they're covered via `QRCanvas.test.ts` instead.
- **QRCanvas.test.ts mock data**: The QR data mock has dark dots in corner patterns (filtered by `squareMask`/`dotMask`) AND in the middle area (9-12, 9-12) plus edge dots at (20,10) and (10,20) for `getNeighbor` bounds testing. Changing this mock affects `drawDots` coverage.
- **setup.ts quirks**: `HTMLCanvasElement.prototype.setAttribute` is explicitly copied from `Element.prototype` because jsdom's prototype chain doesn't always inherit it to canvas instances.

## Style

Prettier: no semicolons, single quotes, no trailing commas, 2-space indent, 100 char width. No ESLint config.

## Workflow Rules

- **Every feature or bugfix requires unit tests.** Add or update tests in `src/__tests__/` alongside code changes. Run `npm test` to verify.
- **Every feature or bugfix requires docs update.** Update the corresponding files under `docs/` (VitePress) to reflect API changes, new options, or behavior changes.

## Conventions

- `tsconfig.json` `include` is `["index.ts", "src"]` — covers Parcel dev entry + full source for IDE. Jest ts-jest overrides this for tests.
- `tsconfig.build.json` extends the base config with `emitDeclarationOnly: true`, targeting `src/index.ts` for type generation.
- `strict: false` in tsconfig.
- Types are emitted to `types/` via `npm run build:type` (runs automatically during `npm run build`).
- `lib/` contains build artifacts (UMD, ESM, CJS). Don't edit directly.
- `src/server.ts` is a dev-only entry for Parcel (`index.html` demo), excluded from coverage.
