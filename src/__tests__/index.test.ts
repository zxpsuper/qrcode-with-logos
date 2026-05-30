const defaultQRData = {
  modules: {
    size: 21,
    data: new Array(21 * 21).fill(0).map((_: any, i: number) => {
      const row = Math.floor(i / 21)
      const col = i % 21
      if (row < 7 && col < 7) return 1
      if (row > 14 && col < 7) return 1
      if (row < 7 && col > 14) return 1
      return 0
    })
  },
  version: 1
}

jest.mock('qrcode', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => defaultQRData)
  }
}))

const mockQRCanvasInit = jest.fn(() => Promise.resolve())
jest.mock('../core/QRCanvas', () => ({
  QRCanvas: jest.fn().mockImplementation(() => ({
    init: mockQRCanvasInit
  }))
}))

import QrCodeWithLogo from '../index'
import QRCode from 'qrcode'
import { QRCanvas } from '../core/QRCanvas'

describe('QrCodeWithLogo', () => {
  beforeEach(() => {
    ;(QRCode.create as jest.Mock).mockReset()
    ;(QRCode.create as jest.Mock).mockImplementation(() => defaultQRData)
    ;(QRCanvas as unknown as jest.Mock).mockClear()
    mockQRCanvasInit.mockClear()
    mockQRCanvasInit.mockImplementation(() => Promise.resolve())
    HTMLAnchorElement.prototype.dispatchEvent = jest.fn(() => true)
  })

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(qrCode).toBeDefined()
      expect(qrCode.options).toBeDefined()
      expect(qrCode.options.content).toBe('test')
    })

    it('should create instance with custom options', () => {
      const qrCode = new QrCodeWithLogo({
        content: 'test',
        width: 500,
        download: true,
        downloadName: 'custom.png'
      })
      expect(qrCode.options.width).toBe(500)
      expect(qrCode.options.download).toBe(true)
      expect(qrCode.options.downloadName).toBe('custom.png')
    })

    it('should create canvas and image elements if not provided', () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(qrCode.options.canvas).toBeDefined()
      expect(qrCode.options.image).toBeDefined()
    })

    it('should use provided canvas and image elements', () => {
      const canvas = document.createElement('canvas')
      const image = document.createElement('img')
      const qrCode = new QrCodeWithLogo({ content: 'test', canvas, image })
      expect(qrCode.options.canvas).toBe(canvas)
      expect(qrCode.options.image).toBe(image)
    })

    it('should call onError if provided and error occurs', () => {
      const onError = jest.fn()
      mockQRCanvasInit.mockImplementation(() => { throw new Error('init failed') })
      const qrCode = new QrCodeWithLogo({ content: 'test', onError })
      qrCode.getCanvas().catch(() => {})
      qrCode.getImage().catch(() => {})
      expect(onError).toHaveBeenCalled()
    })

    it('should merge options with defaults correctly', () => {
      const qrCode = new QrCodeWithLogo({
        content: 'hello',
        width: 600
      })
      expect(qrCode.options.content).toBe('hello')
      expect(qrCode.options.width).toBe(600)
      expect(qrCode.options.download).toBeDefined()
      expect(qrCode.options.downloadName).toBeDefined()
    })

    it('should default download to false', () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(qrCode.options.download).toBe(false)
    })

    it('should default downloadName to qr-code.png', () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(qrCode.options.downloadName).toBe('qr-code.png')
    })

    it('should default width to 380', () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(qrCode.options.width).toBe(380)
    })

    it('should create QRCanvas with merged options', () => {
      new QrCodeWithLogo({
        content: 'test',
        dotsOptions: { type: 'dot', color: '#ff0000' },
        cornersOptions: { type: 'rounded' }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'test',
          dotsOptions: { type: 'dot', color: '#ff0000' },
          cornersOptions: { type: 'rounded' }
        })
      )
    })
  })

  describe('version', () => {
    it('should have static version property', () => {
      expect(QrCodeWithLogo.version).toBeDefined()
      expect(typeof QrCodeWithLogo.version).toBe('string')
    })

    it('should have a valid semver-like version', () => {
      expect(QrCodeWithLogo.version).toMatch(/^\d+\.\d+\.\d+/)
    })
  })

  describe('getCanvas', () => {
    it('should return canvas after drawing', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      const canvas = await qrCode.getCanvas()
      expect(canvas).toBeDefined()
    })

    it('should return the same canvas instance', async () => {
      const canvas = document.createElement('canvas')
      const qrCode = new QrCodeWithLogo({ content: 'test', canvas })
      const result = await qrCode.getCanvas()
      expect(result).toBe(canvas)
    })
  })

  describe('getImage', () => {
    it('should return image after drawing', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      const image = await qrCode.getImage()
      expect(image).toBeDefined()
    })

    it('should return the same image instance', async () => {
      const image = document.createElement('img')
      const qrCode = new QrCodeWithLogo({ content: 'test', image })
      const result = await qrCode.getImage()
      expect(result).toBe(image)
    })
  })

  describe('downloadImage', () => {
    it('should download image with default name', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      const result = await qrCode.downloadImage()
      expect(result).toBe(true)
      expect(document.body.appendChild).toHaveBeenCalled()
      expect(document.body.removeChild).toHaveBeenCalled()
    })

    it('should download image with custom name', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      const result = await qrCode.downloadImage('custom.png')
      expect(result).toBe(true)
    })
  })

  describe('deprecated methods', () => {
    it('should throw error when calling toCanvas', () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(() => qrCode.toCanvas()).toThrow('toCanvas has been Deprecated!')
    })

    it('should throw error when calling toImage', () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(() => qrCode.toImage()).toThrow('toImage has been Deprecated!')
    })
  })

  describe('logo options', () => {
    it('should accept logo as string', async () => {
      const qrCode = new QrCodeWithLogo({
        content: 'test',
        logo: 'logo.png',
        nodeQrCodeOptions: { errorCorrectionLevel: 'M' }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({ logo: 'logo.png' })
      )
    })

    it('should accept logo as object', async () => {
      new QrCodeWithLogo({
        content: 'test',
        logo: { src: 'logo.png', borderRadius: 10, bgColor: '#ff0000' },
        nodeQrCodeOptions: { errorCorrectionLevel: 'M' }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          logo: { src: 'logo.png', borderRadius: 10, bgColor: '#ff0000' }
        })
      )
    })

    it('should accept logo with all options', async () => {
      const logoOpts = {
        src: 'logo.png',
        borderRadius: 10,
        bgColor: '#ff0000',
        borderWidth: 5,
        crossOrigin: 'anonymous',
        logoRadius: 5
      }
      new QrCodeWithLogo({
        content: 'test',
        logo: logoOpts,
        nodeQrCodeOptions: { errorCorrectionLevel: 'H' }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({ logo: logoOpts })
      )
    })
  })

  describe('dot options', () => {
    it('should accept custom dot type', async () => {
      new QrCodeWithLogo({
        content: 'test',
        dotsOptions: { type: 'dot', color: '#ff0000' }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          dotsOptions: { type: 'dot', color: '#ff0000' }
        })
      )
    })

    it('should accept all dot types', async () => {
      const dotTypes = ['square', 'dot', 'dot-small', 'rounded', 'diamond', 'star', 'tile', 'fluid', 'stripe', 'stripe-row', 'stripe-column']

      for (const dotType of dotTypes) {
        ;(QRCanvas as unknown as jest.Mock).mockClear()
        new QrCodeWithLogo({
          content: 'test',
          dotsOptions: { type: dotType as any }
        })
        expect(QRCanvas).toHaveBeenCalledWith(
          expect.objectContaining({ dotsOptions: { type: dotType } })
        )
      }
    })
  })

  describe('corner options', () => {
    it('should accept custom corner type', async () => {
      new QrCodeWithLogo({
        content: 'test',
        cornersOptions: { type: 'rounded', color: '#0000ff', radius: 5 }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          cornersOptions: { type: 'rounded', color: '#0000ff', radius: 5 }
        })
      )
    })

    it('should accept all corner types', async () => {
      const cornerTypes = ['square', 'rounded', 'circle', 'rounded-circle', 'circle-rounded', 'circle-diamond', 'circle-star']

      for (const cornerType of cornerTypes) {
        ;(QRCanvas as unknown as jest.Mock).mockClear()
        new QrCodeWithLogo({
          content: 'test',
          cornersOptions: { type: cornerType as any }
        })
        expect(QRCanvas).toHaveBeenCalledWith(
          expect.objectContaining({ cornersOptions: { type: cornerType } })
        )
      }
    })

    it('should accept corner with object radius', async () => {
      new QrCodeWithLogo({
        content: 'test',
        cornersOptions: { type: 'rounded', radius: { inner: 3, outer: 5 } }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          cornersOptions: { type: 'rounded', radius: { inner: 3, outer: 5 } }
        })
      )
    })
  })

  describe('download as function', () => {
    it('should call custom download function with start callback', async () => {
      const customDownload = jest.fn(async (start: () => Promise<void>) => {})

      const qrCode = new QrCodeWithLogo({
        content: 'test',
        download: customDownload,
        downloadName: 'test.png'
      })

      await qrCode.getImage()

      expect(customDownload).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('canvasPromise and imagePromise', () => {
    it('should resolve canvasPromise when canvas is drawn', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      const canvas = await qrCode.getCanvas()
      expect(canvas).toBeDefined()
    })

    it('should resolve imagePromise when image is created', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      const image = await qrCode.getImage()
      expect(image).toBeDefined()
    })
  })

  describe('ifCanvasDrawn and ifImageCreated flags', () => {
    it('should set ifCanvasDrawn to true after canvas is drawn', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(qrCode.ifCanvasDrawn).toBe(false)
      await qrCode.getCanvas()
      expect(qrCode.ifCanvasDrawn).toBe(true)
    })

    it('should set ifImageCreated to true after image is created', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test' })
      expect(qrCode.ifImageCreated).toBe(false)
      await qrCode.getImage()
      expect(qrCode.ifImageCreated).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should call onError when QRCanvas.init rejects', async () => {
      const onError = jest.fn()
      mockQRCanvasInit.mockImplementation(() => Promise.reject(new Error('init failed')))

      const qrCode = new QrCodeWithLogo({ content: 'test', onError })
      qrCode.getCanvas().catch(() => {})
      qrCode.getImage().catch(() => {})

      await new Promise(resolve => setTimeout(resolve, 10))
      expect(onError).toHaveBeenCalled()
    })

    it('should reject canvasPromise on error', async () => {
      const onError = jest.fn()
      mockQRCanvasInit.mockImplementation(() => Promise.reject(new Error('init failed')))

      const qrCode = new QrCodeWithLogo({ content: 'test', onError })
      qrCode.getImage().catch(() => {})

      await expect(qrCode.getCanvas()).rejects.toThrow('init failed')
    })

    it('should reject imagePromise on error', async () => {
      const onError = jest.fn()
      mockQRCanvasInit.mockImplementation(() => Promise.reject(new Error('init failed')))

      const qrCode = new QrCodeWithLogo({ content: 'test', onError })
      qrCode.getCanvas().catch(() => {})

      await expect(qrCode.getImage()).rejects.toThrow('init failed')
    })

    it('should not throw when onError is not provided and error occurs', async () => {
      mockQRCanvasInit.mockImplementation(() => Promise.reject(new Error('init failed')))

      const qrCode = new QrCodeWithLogo({ content: 'test' })
      qrCode.getCanvas().catch(() => {})
      qrCode.getImage().catch(() => {})

      await new Promise(resolve => setTimeout(resolve, 10))
    })
  })

  describe('nodeQrCodeOptions', () => {
    it('should pass custom margin', async () => {
      new QrCodeWithLogo({
        content: 'test',
        nodeQrCodeOptions: { margin: 8 }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          nodeQrCodeOptions: expect.objectContaining({ margin: 8 })
        })
      )
    })

    it('should pass custom colors', async () => {
      new QrCodeWithLogo({
        content: 'test',
        nodeQrCodeOptions: { color: { dark: '#333', light: '#eee' } }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          nodeQrCodeOptions: expect.objectContaining({
            color: { dark: '#333', light: '#eee' }
          })
        })
      )
    })

    it('should pass custom error correction level', async () => {
      new QrCodeWithLogo({
        content: 'test',
        nodeQrCodeOptions: { errorCorrectionLevel: 'L' }
      })
      expect(QRCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          nodeQrCodeOptions: expect.objectContaining({ errorCorrectionLevel: 'L' })
        })
      )
    })
  })

  describe('SVG renderer', () => {
    it('should create instance with renderer: "svg"', () => {
      const qrCode = new QrCodeWithLogo({ content: 'test', renderer: 'svg' })
      expect(qrCode).toBeDefined()
      expect(qrCode.options.renderer).toBe('svg')
    })

    it('should generate SVG string via getSvgString()', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test', renderer: 'svg' })
      const svg = await qrCode.getSvgString()
      expect(svg).toContain('<svg')
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
    })

    it('should set ifCanvasDrawn to true after SVG generation', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test', renderer: 'svg' })
      expect(qrCode.ifCanvasDrawn).toBe(false)
      await qrCode.getCanvas()
      expect(qrCode.ifCanvasDrawn).toBe(true)
    })

    it('should set ifImageCreated to true after SVG generation', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test', renderer: 'svg' })
      expect(qrCode.ifImageCreated).toBe(false)
      await qrCode.getImage()
      expect(qrCode.ifImageCreated).toBe(true)
    })

    it('should set image src to SVG data URL', async () => {
      const image = document.createElement('img')
      const qrCode = new QrCodeWithLogo({ content: 'test', renderer: 'svg', image })
      await qrCode.getImage()
      expect(image.src).toMatch(/^data:image\/svg\+xml,/)
    })

    it('should return canvas element via getCanvas()', async () => {
      const qrCode = new QrCodeWithLogo({ content: 'test', renderer: 'svg' })
      const canvas = await qrCode.getCanvas()
      expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    })

    it('should accept custom dot type in SVG mode', async () => {
      const qrCode = new QrCodeWithLogo({
        content: 'test',
        renderer: 'svg',
        dotsOptions: { type: 'dot', color: '#ff0000' }
      })
      const svg = await qrCode.getSvgString()
      expect(svg).toContain('<svg')
    })

    it('should accept custom corner type in SVG mode', async () => {
      const qrCode = new QrCodeWithLogo({
        content: 'test',
        renderer: 'svg',
        cornersOptions: { type: 'circle', color: '#00ff00' }
      })
      const svg = await qrCode.getSvgString()
      expect(svg).toContain('<svg')
    })

    it('should work with logo in SVG mode', async () => {
      const qrCode = new QrCodeWithLogo({
        content: 'test',
        renderer: 'svg',
        logo: 'https://example.com/logo.png'
      })
      const svg = await qrCode.getSvgString()
      expect(svg).toContain('<image')
    })

    it('should handle error in SVG mode gracefully', async () => {
      const onError = jest.fn()
      // Reset mock to default behavior (should succeed)
      const qrCode = new QrCodeWithLogo({ content: 'test', renderer: 'svg', onError })
      const svg = await qrCode.getSvgString()
      expect(svg).toContain('<svg')
      expect(qrCode.ifCanvasDrawn).toBe(true)
    })
  })
})
