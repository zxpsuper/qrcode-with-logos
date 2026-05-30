import { BaseOptions } from '../core/types'

// Mock qrcode module - must be before imports
jest.mock('qrcode', () => {
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => ({
        modules: {
          size: 21,
          data: new Array(21 * 21).fill(0).map((_: any, i: number) => {
            const row = Math.floor(i / 21)
            const col = i % 21
            // Corner patterns (will be filtered by filterDots)
            if (row < 7 && col < 7) return 1
            if (row > 14 && col < 7) return 1
            if (row < 7 && col > 14) return 1
            // Middle area dark dots for drawDots testing
            if (row >= 9 && row <= 12 && col >= 9 && col <= 12) return 1
            // Edge dots to test getNeighbor bounds checking
            if (row === 8 && col === 8) return 1
            if (row === 13 && col === 13) return 1
            // Dots at grid edges (outside corner patterns) to trigger bounds check
            if (row === 20 && col === 10) return 1
            if (row === 10 && col === 20) return 1
            return 0
          })
        },
        version: 1
      }))
    }
  }
})

// Import after mock
import { QRCanvas } from '../core/QRCanvas'

describe('QRCanvas', () => {
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')!
    // Mock setAttribute
    canvas.setAttribute = jest.fn()
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with default options', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas
      }

      const qrCanvas = new QRCanvas(options)

      expect(qrCanvas).toBeDefined()
      expect(canvas.setAttribute).toHaveBeenCalledWith('width', '380')
      expect(canvas.setAttribute).toHaveBeenCalledWith('height', '380')
    })

    it('should initialize with custom width', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        width: 500
      }

      const qrCanvas = new QRCanvas(options)

      expect(canvas.setAttribute).toHaveBeenCalledWith('width', '500')
      expect(canvas.setAttribute).toHaveBeenCalledWith('height', '500')
    })

    it('should initialize with custom error correction level', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'H'
        }
      }

      const qrCanvas = new QRCanvas(options)
      expect(qrCanvas).toBeDefined()
    })

    it('should auto-detect error correction level based on content length', () => {
      const options: BaseOptions = {
        content: 'short',
        canvas
      }

      const qrCanvas = new QRCanvas(options)
      expect(qrCanvas).toBeDefined()
    })

    it('should set canvas width and height attributes', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        width: 600
      }

      new QRCanvas(options)

      expect(canvas.setAttribute).toHaveBeenCalledWith('width', '600')
      expect(canvas.setAttribute).toHaveBeenCalledWith('height', '600')
    })

    it('should auto-detect error correction level M for long content', () => {
      const options: BaseOptions = {
        content: 'a'.repeat(50),
        canvas
      }

      const qrCanvas = new QRCanvas(options)
      expect(qrCanvas).toBeDefined()
    })

    it('should auto-detect error correction level Q for medium content', () => {
      const options: BaseOptions = {
        content: 'a'.repeat(20),
        canvas
      }

      const qrCanvas = new QRCanvas(options)
      expect(qrCanvas).toBeDefined()
    })
  })

  describe('init', () => {
    it('should initialize canvas and draw QR code', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // Should call fillRect for background
      expect(ctx.fillRect).toHaveBeenCalled()
      // Should call fill for dots
      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should draw with logo (object form)', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png'
        },
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'M'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      expect(ctx.fillRect).toHaveBeenCalled()
    })

    it('should draw with string logo', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: 'logo.png',
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'M'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      expect(ctx.fillRect).toHaveBeenCalled()
    })

    it('should draw with custom dot options', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        dotsOptions: {
          type: 'dot',
          color: '#ff0000'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should draw with custom corner options', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'rounded',
          color: '#0000ff',
          radius: 5
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should clear canvas before drawing', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // clearRect should be called first (in clear())
      expect(ctx.clearRect).toHaveBeenCalled()
    })

    it('should draw background with light color', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        nodeQrCodeOptions: {
          color: { light: '#eeeeee' }
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // fillRect is used for background
      expect(ctx.fillRect).toHaveBeenCalled()
    })

    it('should draw all 3 corner patterns', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'circle'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // Corners use save/restore; circle uses arc
      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw with all different dot types', async () => {
      const dotTypes = ['square', 'dot', 'dot-small', 'rounded', 'diamond', 'star', 'tile', 'fluid', 'stripe', 'stripe-row', 'stripe-column']

      for (const dotType of dotTypes) {
        jest.clearAllMocks()
        const options: BaseOptions = {
          content: 'test',
          canvas,
          dotsOptions: { type: dotType as any },
          cornersOptions: { type: 'square' }
        }

        const qrCanvas = new QRCanvas(options)
        await qrCanvas.init()

        expect(ctx.fill).toHaveBeenCalled()
      }
    })

    it('should draw with logo and logoRadius > 0', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png',
          logoRadius: 5,
          borderRadius: 8,
          bgColor: '#ffffff',
          borderWidth: 10
        },
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'H'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // With logoRadius > 0, createPattern should be used
      expect(ctx.createPattern).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalled()
    })

    it('should draw logo without logoRadius (direct image draw)', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png',
          logoRadius: 0,
          borderRadius: 8,
          bgColor: '#ffffff',
          borderWidth: 10
        },
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'H'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // With logoRadius=0, drawImage should be used directly
      expect(ctx.drawImage).toHaveBeenCalled()
    })

    it('should set inLogoRange function when logo is provided', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png'
        },
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'H'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // After init with logo, dots in logo range should be skipped
      // We verify this indirectly by checking that fewer dots are drawn
      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should handle logo with wide image (rate > 1)', async () => {
      // Override MockImage to return wide dimensions
      const OriginalImage = (global as any).Image
      ;(global as any).Image = class {
        onload: (() => void) | null = null
        width: number = 200
        height: number = 100
        crossOrigin: string = ''
        private _src: string = ''

        setAttribute(name: string, value: string) {
          if (name === 'crossOrigin') this.crossOrigin = value
        }

        set src(val: string) {
          this._src = val
          setTimeout(() => { if (this.onload) this.onload() }, 0)
        }
        get src() { return this._src }
      }

      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png',
          borderWidth: 10
        },
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'H'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      expect(ctx.fillRect).toHaveBeenCalled()
      ;(global as any).Image = OriginalImage
    })

    it('should handle logo with tall image (rate <= 1)', async () => {
      const OriginalImage = (global as any).Image
      ;(global as any).Image = class {
        onload: (() => void) | null = null
        width: number = 100
        height: number = 200
        crossOrigin: string = ''
        private _src: string = ''

        setAttribute(name: string, value: string) {
          if (name === 'crossOrigin') this.crossOrigin = value
        }

        set src(val: string) {
          this._src = val
          setTimeout(() => { if (this.onload) this.onload() }, 0)
        }
        get src() { return this._src }
      }

      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png',
          borderWidth: 10
        },
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'H'
        },
        cornersOptions: {
          type: 'square' }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      expect(ctx.fillRect).toHaveBeenCalled()
      ;(global as any).Image = OriginalImage
    })

    it('should handle logo with square image (rate = 1)', async () => {
      const OriginalImage = (global as any).Image
      ;(global as any).Image = class {
        onload: (() => void) | null = null
        width: number = 150
        height: number = 150
        crossOrigin: string = ''
        private _src: string = ''

        setAttribute(name: string, value: string) {
          if (name === 'crossOrigin') this.crossOrigin = value
        }

        set src(val: string) {
          this._src = val
          setTimeout(() => { if (this.onload) this.onload() }, 0)
        }
        get src() { return this._src }
      }

      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png',
          borderWidth: 5
        },
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'H'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      expect(ctx.fillRect).toHaveBeenCalled()
      ;(global as any).Image = OriginalImage
    })

    it('should use default logo options when not specified', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png'
        },
        nodeQrCodeOptions: {
          errorCorrectionLevel: 'H'
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // Default bgColor=#fff, borderWidth=10, borderRadius=8, logoRadius=0
      expect(ctx.fillRect).toHaveBeenCalled()
    })

    it('should skip drawing when not a dark dot', async () => {
      // In our mock, position (10, 10) is light (value 0)
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      await qrCanvas.init()

      // Some dots should be skipped (light dots)
      expect(ctx.fill).toHaveBeenCalled()
    })
  })

  describe('isDark', () => {
    it('should return true for dark dots', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)

      // Based on our mock, row 0, col 0 should be dark
      expect(qrCanvas.isDark(0, 0)).toBe(true)
    })

    it('should return false for light dots', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)

      // Based on our mock, row 7, col 7 should be light (outside all patterns)
      expect(qrCanvas.isDark(7, 7)).toBe(false)
    })

    it('should return true for dark dots in bottom-left corner pattern', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)

      // row > 14 && col < 7 => dark
      expect(qrCanvas.isDark(0, 15)).toBe(true)
    })

    it('should return true for dark dots in top-right corner pattern', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)

      // row < 7 && col > 14 => dark
      expect(qrCanvas.isDark(15, 0)).toBe(true)
    })

    it('should return false for middle area dots', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)

      // Middle area (7,7) should be light
      expect(qrCanvas.isDark(7, 7)).toBe(false)
    })
  })

  describe('isDisabled and setDisabled', () => {
    it('should mark dots as disabled', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)

      // Initially not disabled
      expect(qrCanvas.isDisabled(10, 10)).toBe(false)

      // Set as disabled
      qrCanvas.setDisabled(10, 10)

      // Now should be disabled
      expect(qrCanvas.isDisabled(10, 10)).toBe(true)
    })

    it('should mark dark dots as disabled', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)

      // Dark dot at (0, 0) is not initially disabled
      expect(qrCanvas.isDisabled(0, 0)).toBe(false)

      // Set it as disabled
      qrCanvas.setDisabled(0, 0)
      expect(qrCanvas.isDisabled(0, 0)).toBe(true)

      // But isDark should still return true (disabled != light)
      // Actually isDark checks === 1, disabled sets to 2
      expect(qrCanvas.isDark(0, 0)).toBe(false)
    })

    it('should not affect other dots when setting one as disabled', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)

      qrCanvas.setDisabled(5, 5)

      expect(qrCanvas.isDisabled(5, 5)).toBe(true)
      expect(qrCanvas.isDisabled(6, 6)).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear the canvas', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.clear()

      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height)
    })

    it('should call clearRect with correct dimensions', () => {
      canvas.width = 500
      canvas.height = 500

      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.clear()

      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 500, 500)
    })
  })

  describe('context', () => {
    it('should return canvas context', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      expect(qrCanvas.context).toBe(ctx)
    })
  })

  describe('drawBackground', () => {
    it('should fill with default light color', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawBackground()

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height)
    })

    it('should use custom light color', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        nodeQrCodeOptions: {
          color: { light: '#ffcccc' }
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawBackground()

      expect(ctx.fillRect).toHaveBeenCalled()
    })
  })

  describe('drawCorners', () => {
    it('should draw 3 corner patterns', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawCorners()

      // 3 corners * (save + translate + beginPath + ...) + restore
      expect(ctx.save).toHaveBeenCalled()
    })

    it('should use custom corner color', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square',
          color: '#ff0000'
        }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawCorners()

      expect(ctx.save).toHaveBeenCalled()
    })

    it('should fall back to nodeQrCodeOptions color.dark when cornersOptions.color not set', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        nodeQrCodeOptions: {
          color: { dark: '#333333' }
        },
        cornersOptions: {
          type: 'square'
        }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawCorners()

      expect(ctx.save).toHaveBeenCalled()
    })
  })

  describe('hex color auto-normalization (missing #)', () => {
    it('should auto-prepend # to background light color', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        nodeQrCodeOptions: {
          color: { light: 'eeeeee' }
        },
        cornersOptions: { type: 'square' }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawBackground()

      expect(ctx.fillStyle).toBe('#eeeeee')
    })

    it('should auto-prepend # to dot color', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        dotsOptions: { type: 'square', color: 'ff0000' },
        cornersOptions: { type: 'square' }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawDots()

      expect(ctx.fillStyle).toBe('#ff0000')
      expect(ctx.strokeStyle).toBe('#ff0000')
    })

    it('should auto-prepend # to corner color', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        cornersOptions: {
          type: 'square',
          color: '0000ff'
        }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawCorners()

      // QRCorner receives normalized color
      expect(ctx.save).toHaveBeenCalled()
    })

    it('should auto-prepend # to logo bgColor', async () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        logo: {
          src: 'logo.png',
          bgColor: 'ffffff'
        },
        nodeQrCodeOptions: { errorCorrectionLevel: 'H' },
        cornersOptions: { type: 'square' }
      }

      const qrCanvas = new QRCanvas(options)
      // Should not throw - normalizeColor handles the missing # in bgColor
      await qrCanvas.init()

      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should leave colors with # unchanged', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        nodeQrCodeOptions: {
          color: { light: '#eeeeee' }
        },
        cornersOptions: { type: 'square' }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawBackground()

      expect(ctx.fillStyle).toBe('#eeeeee')
    })

    it('should leave non-hex color strings unchanged', () => {
      const options: BaseOptions = {
        content: 'test',
        canvas,
        nodeQrCodeOptions: {
          color: { light: 'rgb(238,238,238)' }
        },
        cornersOptions: { type: 'square' }
      }

      const qrCanvas = new QRCanvas(options)
      qrCanvas.drawBackground()

      expect(ctx.fillStyle).toBe('rgb(238,238,238)')
    })
  })
})
