# AGENTS.md

## Commands

```bash
npm test                    # Jest unit tests with coverage (jsdom environment)
npm test -- -t "test name"  # Single test by name
npm run build               # Tests + webpack UMD + rollup ESM/CJS + types
npm run build:min           # Webpack UMD only → lib/qrcode-with-logos.min.js
npm run build:rollup        # Rollup ESM + CJS → lib/qrcode-with-logos.{esm,common}.js
npm run build:type          # Type declarations → types/
npm run test:e2e            # Build + all e2e tests (browser + Node.js)
npm run test:e2e:node       # Node.js e2e tests only
npm run test:e2e:quick      # E2e tests without rebuild
npm start                   # Parcel dev server (demo page)
npm run docs:dev            # VitePress docs
```

No lint or typecheck scripts exist. No CI workflows. Run `npm test` and `npm run test:e2e` before release.

## Architecture

Single-package QR code library. Entry: `src/index.ts`. Only runtime dependency: `qrcode`.

**Two rendering modes**:
- Canvas (default): `QrCodeWithLogo` → `_toCanvas()` → `_toImage()`
- SVG: `QrCodeWithLogo` → `_toSvg()` → `getSvgString()`

**Core classes**:
- `QRCanvas` — canvas rendering orchestration
- `QRSvg` — SVG string generation (works in Node.js)
- `QRDot` / `SvgDot` — dot rendering (12 styles)
- `QRCorner` / `SvgCorner` — corner rendering (7 styles)

**Build outputs**:
- webpack → UMD (minified, qrcode inlined)
- rollup → ESM + CJS (qrcode external, version injected via @rollup/plugin-replace)

## Node.js Compatibility

| Bundle | Node.js |
|--------|---------|
| CJS | ✅ |
| UMD | ✅ |
| ESM | ❌ (ES import + CJS package issue) |

Supported in Node.js: SVG renderer without logo, or with base64 logo + explicit width/height. Canvas renderer requires browser APIs.

## Testing

**Unit tests** (`src/__tests__/`):
- Environment: jsdom
- Canvas/Image APIs mocked in `setup.ts`
- Coverage exclusions: `src/core/types.ts`
- 286 tests

**E2E tests** (`e2e/`):
- `cjs.test.ts` — CJS bundle in jsdom
- `umd.test.ts` — UMD bundle in jsdom
- `node.test.ts` — CJS bundle in Node.js environment
- `esm.test.mjs` — ESM bundle
- `shared.ts` — shared test logic for browser bundles
- Browser e2e: 152 tests, Node.js e2e: 17 tests

**Key test behaviors**:
- SVG + logo tests use base64 data URLs to avoid MockImage timing issues
- Error handling tests use `onError` callback to capture rejections
- Node.js tests verify Canvas renderer throws appropriate error

## Style

Prettier: no semicolons, single quotes, no trailing commas, 2-space indent, 100 char width. No ESLint config.

## Workflow Rules

- **Every feature or bugfix requires unit tests.** Run `npm test` to verify.
- **Every feature or bugfix requires docs update.** Update `docs/` (VitePress).
- **Run e2e tests before release.** Use `npm run test:e2e`.

## Conventions

- Version: placeholder `'0.0.0'` in source, replaced by `@rollup/plugin-replace` at build time
- Types emitted to `types/` via `npm run build:type`
- `lib/` contains build artifacts — don't edit directly
- `strict: false` in tsconfig
