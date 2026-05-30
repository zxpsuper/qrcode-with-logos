import { BaseOptions, DotType, CornerType } from '../src/core/types'

// Minimal interface matching what the built bundle exports
interface QrCodeWithLogoInstance {
  options: BaseOptions
  ifCanvasDrawn: boolean
  ifImageCreated: boolean
  getCanvas(): Promise<HTMLCanvasElement>
  getImage(): Promise<HTMLImageElement>
  downloadImage(name?: string): Promise<boolean>
  toCanvas(): void
  toImage(): void
}

interface QrCodeWithLogoClass {
  new (options: BaseOptions): QrCodeWithLogoInstance
  version: string
}

// Helper: wait a tick for async init to settle
const tick = () => new Promise((r) => setTimeout(r, 0))

export function runBundleTests(
  description: string,
  QrCodeWithLogo: QrCodeWithLogoClass
): void {
  describe(description, () => {
    // ====== Basic Instantiation ======
    describe('instantiation', () => {
      it('creates instance with minimal content', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(qr).toBeDefined()
      })

      it('applies default width (380)', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(qr.options.width).toBe(380)
      })

      it('applies default download (false)', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(qr.options.download).toBe(false)
      })

      it('applies default downloadName (qr-code.png)', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(qr.options.downloadName).toBe('qr-code.png')
      })

      it('accepts custom width', () => {
        const qr = new QrCodeWithLogo({ content: 'hello', width: 500 })
        expect(qr.options.width).toBe(500)
      })

      it('accepts custom downloadName', () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          downloadName: 'custom.png',
        })
        expect(qr.options.downloadName).toBe('custom.png')
      })

      it('auto-creates canvas when not provided', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(qr.options.canvas).toBeInstanceOf(HTMLCanvasElement)
      })

      it('auto-creates image when not provided', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(qr.options.image).toBeInstanceOf(HTMLImageElement)
      })

      it('uses provided canvas element', () => {
        const canvas = document.createElement('canvas')
        const qr = new QrCodeWithLogo({ content: 'hello', canvas })
        expect(qr.options.canvas).toBe(canvas)
      })

      it('uses provided image element', () => {
        const image = document.createElement('img')
        const qr = new QrCodeWithLogo({ content: 'hello', image })
        expect(qr.options.image).toBe(image)
      })
    })

    // ====== Canvas Operations ======
    describe('canvas operations', () => {
      it('getCanvas() returns an HTMLCanvasElement', async () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        const canvas = await qr.getCanvas()
        expect(canvas).toBeInstanceOf(HTMLCanvasElement)
      })

      it('ifCanvasDrawn is false before canvas resolves', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(qr.ifCanvasDrawn).toBe(false)
      })

      it('ifCanvasDrawn is true after getCanvas() resolves', async () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })

      it('returns the same canvas instance that was provided', async () => {
        const canvas = document.createElement('canvas')
        const qr = new QrCodeWithLogo({ content: 'hello', canvas })
        const result = await qr.getCanvas()
        expect(result).toBe(canvas)
      })

      it('sets canvas dimensions matching width', async () => {
        const qr = new QrCodeWithLogo({ content: 'hello', width: 300 })
        const canvas = await qr.getCanvas()
        expect(canvas.width).toBe(300)
        expect(canvas.height).toBe(300)
      })
    })

    // ====== Image Operations ======
    describe('image operations', () => {
      it('getImage() returns an HTMLImageElement', async () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        const image = await qr.getImage()
        expect(image).toBeInstanceOf(HTMLImageElement)
      })

      it('ifImageCreated is false before image resolves', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(qr.ifImageCreated).toBe(false)
      })

      it('ifImageCreated is true after getImage() resolves', async () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        await qr.getImage()
        expect(qr.ifImageCreated).toBe(true)
      })

      it('returns the same image instance that was provided', async () => {
        const image = document.createElement('img')
        const qr = new QrCodeWithLogo({ content: 'hello', image })
        const result = await qr.getImage()
        expect(result).toBe(image)
      })

      it('sets image src to a data URL', async () => {
        const image = document.createElement('img')
        const qr = new QrCodeWithLogo({ content: 'hello', image })
        await qr.getImage()
        expect(image.src).toMatch(/^data:image\/png;base64,/)
      })
    })

    // ====== Logo Handling ======
    describe('logo', () => {
      it('accepts logo as string', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          logo: 'https://example.com/logo.png',
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })

      it('accepts logo as object with src', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          logo: { src: 'https://example.com/logo.png' },
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })

      it('accepts logo with all options', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          logo: {
            src: 'https://example.com/logo.png',
            borderRadius: 10,
            bgColor: '#ff0000',
            borderWidth: 5,
            crossOrigin: 'anonymous',
            logoRadius: 5,
          },
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })

      it('works without logo', async () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })
    })

    // ====== Dot Styles ======
    describe('dot styles', () => {
      const dotTypes: DotType[] = [
        'square',
        'dot',
        'dot-small',
        'rounded',
        'diamond',
        'star',
        'tile',
        'fluid',
        'fluid-line',
        'stripe',
        'stripe-row',
        'stripe-column',
      ]

      dotTypes.forEach((type) => {
        it(`renders dot type "${type}"`, async () => {
          const qr = new QrCodeWithLogo({
            content: 'hello',
            dotsOptions: { type },
          })
          await qr.getCanvas()
          expect(qr.ifCanvasDrawn).toBe(true)
        })
      })

      it('accepts custom dot color', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          dotsOptions: { color: '#ff0000' },
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })
    })

    // ====== Corner Styles ======
    describe('corner styles', () => {
      const cornerTypes: CornerType[] = [
        'square',
        'rounded',
        'circle',
        'rounded-circle',
        'circle-rounded',
        'circle-star',
        'circle-diamond',
      ]

      cornerTypes.forEach((type) => {
        it(`renders corner type "${type}"`, async () => {
          const qr = new QrCodeWithLogo({
            content: 'hello',
            cornersOptions: { type },
          })
          await qr.getCanvas()
          expect(qr.ifCanvasDrawn).toBe(true)
        })
      })

      it('accepts custom corner color', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          cornersOptions: { color: '#00ff00' },
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })

      it('accepts corner radius as number', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          cornersOptions: { radius: 5 },
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })

      it('accepts corner radius as object', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          cornersOptions: { radius: { inner: 3, outer: 5 } },
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })
    })

    // ====== nodeQrCodeOptions ======
    describe('nodeQrCodeOptions', () => {
      it('accepts custom margin', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          nodeQrCodeOptions: { margin: 8 },
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })

      it('accepts custom colors', async () => {
        const qr = new QrCodeWithLogo({
          content: 'hello',
          nodeQrCodeOptions: { color: { dark: '#333', light: '#eee' } },
        })
        await qr.getCanvas()
        expect(qr.ifCanvasDrawn).toBe(true)
      })

      const levels = ['L', 'M', 'Q', 'H'] as const
      levels.forEach((level) => {
        it(`accepts errorCorrectionLevel "${level}"`, async () => {
          const qr = new QrCodeWithLogo({
            content: 'hello',
            nodeQrCodeOptions: { errorCorrectionLevel: level },
          })
          await qr.getCanvas()
          expect(qr.ifCanvasDrawn).toBe(true)
        })
      })
    })

    // ====== Version ======
    describe('static version', () => {
      it('is defined', () => {
        expect(QrCodeWithLogo.version).toBeDefined()
      })

      it('is a string', () => {
        expect(typeof QrCodeWithLogo.version).toBe('string')
      })

      it('matches semver format', () => {
        expect(QrCodeWithLogo.version).toMatch(/^\d+\.\d+\.\d+/)
      })
    })

    // ====== Download ======
    describe('download', () => {
      beforeEach(() => {
        HTMLAnchorElement.prototype.dispatchEvent = jest.fn(() => true)
      })

      it('downloadImage() with default name resolves to true', async () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        const result = await qr.downloadImage()
        expect(result).toBe(true)
      })

      it('downloadImage() with custom name resolves to true', async () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        const result = await qr.downloadImage('custom.png')
        expect(result).toBe(true)
      })

      it('download: true triggers auto-download on construction', async () => {
        new QrCodeWithLogo({ content: 'hello', download: true })
        await tick()
        expect(document.body.appendChild).toHaveBeenCalled()
        expect(document.body.removeChild).toHaveBeenCalled()
      })

      it('custom download function is called with start callback', async () => {
        const customDownload = jest.fn()
        const qr = new QrCodeWithLogo({
          content: 'hello',
          download: customDownload,
        })
        await qr.getImage()
        expect(customDownload).toHaveBeenCalledWith(expect.any(Function))
      })
    })

    // ====== Deprecated Methods ======
    describe('deprecated methods', () => {
      it('toCanvas() throws', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(() => qr.toCanvas()).toThrow('toCanvas has been Deprecated!')
      })

      it('toImage() throws', () => {
        const qr = new QrCodeWithLogo({ content: 'hello' })
        expect(() => qr.toImage()).toThrow('toImage has been Deprecated!')
      })
    })

    // ====== Error Handling ======
    describe('error handling', () => {
      it('calls onError when qrcode creation fails (empty content)', () => {
        const onError = jest.fn()
        const qr = new QrCodeWithLogo({ content: '', onError })
        // Suppress unhandled rejections
        qr.getCanvas().catch(() => {})
        qr.getImage().catch(() => {})
        expect(onError).toHaveBeenCalled()
      })

      it('getCanvas() rejects when qrcode creation fails', async () => {
        const qr = new QrCodeWithLogo({ content: '' })
        await expect(qr.getCanvas()).rejects.toBeDefined()
      })

      it('getImage() rejects when qrcode creation fails', async () => {
        const qr = new QrCodeWithLogo({ content: '' })
        await expect(qr.getImage()).rejects.toBeDefined()
      })

      it('does not throw when onError is not provided', () => {
        const qr = new QrCodeWithLogo({ content: '' })
        // Attach catch handlers to prevent unhandled promise rejections
        qr.getCanvas().catch(() => {})
        qr.getImage().catch(() => {})
        expect(() => qr).not.toThrow()
      })

      it('ifCanvasDrawn remains false on error', async () => {
        const qr = new QrCodeWithLogo({ content: '' })
        await expect(qr.getCanvas()).rejects.toBeDefined()
        expect(qr.ifCanvasDrawn).toBe(false)
      })

      it('ifImageCreated remains false on error', async () => {
        const qr = new QrCodeWithLogo({ content: '' })
        await expect(qr.getImage()).rejects.toBeDefined()
        expect(qr.ifImageCreated).toBe(false)
      })
    })
  })
}
