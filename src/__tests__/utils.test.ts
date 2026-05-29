import {
  getErrorCorrectionLevel,
  loadImage,
  canvasRoundRect,
  isFunction,
  toImage,
  saveImage,
  normalizeColor
} from '../core/utils'
import { BaseOptions } from '../core/types'

describe('utils', () => {
  describe('getErrorCorrectionLevel', () => {
    it('should return H for content length <= 16', () => {
      expect(getErrorCorrectionLevel('short')).toBe('H')
      expect(getErrorCorrectionLevel('1234567890123456')).toBe('H')
    })

    it('should return Q for content length > 16 and <= 36', () => {
      expect(getErrorCorrectionLevel('12345678901234567')).toBe('Q')
      expect(getErrorCorrectionLevel('a'.repeat(36))).toBe('Q')
    })

    it('should return M for content length > 36', () => {
      expect(getErrorCorrectionLevel('a'.repeat(37))).toBe('M')
    })

    it('should return H for empty content', () => {
      expect(getErrorCorrectionLevel('')).toBe('H')
    })

    it('should return H for single character content', () => {
      expect(getErrorCorrectionLevel('a')).toBe('H')
    })

    it('should return Q at exact boundary of 17 chars', () => {
      expect(getErrorCorrectionLevel('a'.repeat(17))).toBe('Q')
    })

    it('should return M at exact boundary of 37 chars', () => {
      expect(getErrorCorrectionLevel('a'.repeat(37))).toBe('M')
    })

    it('should return M for very long content', () => {
      expect(getErrorCorrectionLevel('a'.repeat(200))).toBe('M')
    })
  })

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function() {})).toBe(true)
      expect(isFunction(Math.max)).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(isFunction(undefined)).toBe(false)
      expect(isFunction(null)).toBe(false)
      expect(isFunction(123)).toBe(false)
      expect(isFunction('string')).toBe(false)
      expect(isFunction({})).toBe(false)
      expect(isFunction([])).toBe(false)
    })

    it('should return true for async functions', () => {
      expect(isFunction(async () => {})).toBe(true)
    })

    it('should return true for generator functions', () => {
      expect(isFunction(function* () {})).toBe(true)
    })

    it('should return false for boolean', () => {
      expect(isFunction(true)).toBe(false)
      expect(isFunction(false)).toBe(false)
    })
  })

  describe('normalizeColor', () => {
    it('should prepend # to 3-digit hex without #', () => {
      expect(normalizeColor('fff')).toBe('#fff')
      expect(normalizeColor('000')).toBe('#000')
      expect(normalizeColor('abc')).toBe('#abc')
    })

    it('should prepend # to 6-digit hex without #', () => {
      expect(normalizeColor('ffffff')).toBe('#ffffff')
      expect(normalizeColor('000000')).toBe('#000000')
      expect(normalizeColor('ff00aa')).toBe('#ff00aa')
    })

    it('should prepend # to 4-digit hex without # (with alpha)', () => {
      expect(normalizeColor('fffa')).toBe('#fffa')
    })

    it('should prepend # to 8-digit hex without # (with alpha)', () => {
      expect(normalizeColor('ffffffaa')).toBe('#ffffffaa')
    })

    it('should handle uppercase hex without #', () => {
      expect(normalizeColor('FFF')).toBe('#FFF')
      expect(normalizeColor('FF00AA')).toBe('#FF00AA')
    })

    it('should return unchanged if already has #', () => {
      expect(normalizeColor('#fff')).toBe('#fff')
      expect(normalizeColor('#ffffff')).toBe('#ffffff')
      expect(normalizeColor('#000')).toBe('#000')
    })

    it('should return non-hex strings unchanged', () => {
      expect(normalizeColor('red')).toBe('red')
      expect(normalizeColor('rgb(255,0,0)')).toBe('rgb(255,0,0)')
      expect(normalizeColor('rgba(0,0,0,0.5)')).toBe('rgba(0,0,0,0.5)')
      expect(normalizeColor('transparent')).toBe('transparent')
      expect(normalizeColor('currentColor')).toBe('currentColor')
    })

    it('should return falsy values unchanged', () => {
      expect(normalizeColor('')).toBe('')
      expect(normalizeColor(null as any)).toBe(null)
      expect(normalizeColor(undefined as any)).toBe(undefined)
    })

    it('should not prepend # to invalid hex lengths', () => {
      expect(normalizeColor('ff')).toBe('ff')
      expect(normalizeColor('fffff')).toBe('fffff')
      expect(normalizeColor('fffffff')).toBe('fffffff')
      expect(normalizeColor('fffffffff')).toBe('fffffffff')
    })

    it('should not prepend # to strings with non-hex chars', () => {
      expect(normalizeColor('ggg')).toBe('ggg')
      expect(normalizeColor('xyz123')).toBe('xyz123')
      expect(normalizeColor('12zzzz')).toBe('12zzzz')
    })
  })

  describe('canvasRoundRect', () => {
    let ctx: CanvasRenderingContext2D

    beforeEach(() => {
      ctx = document.createElement('canvas').getContext('2d')!
      jest.clearAllMocks()
    })

    it('should draw a rounded rectangle', () => {
      const roundRect = canvasRoundRect(ctx)
      const result = roundRect(10, 20, 100, 50, 8)

      expect(ctx.beginPath).toHaveBeenCalled()
      expect(ctx.moveTo).toHaveBeenCalledWith(18, 20)
      expect(ctx.arcTo).toHaveBeenCalledTimes(4)
      expect(ctx.closePath).toHaveBeenCalled()
      expect(result).toBe(ctx)
    })

    it('should limit radius to half of minimum dimension', () => {
      const roundRect = canvasRoundRect(ctx)
      roundRect(0, 0, 20, 10, 100)

      // Radius should be clamped to 5 (half of min dimension 10)
      expect(ctx.moveTo).toHaveBeenCalledWith(5, 0)
    })

    it('should handle zero radius', () => {
      const roundRect = canvasRoundRect(ctx)
      const result = roundRect(0, 0, 100, 100, 0)

      expect(ctx.moveTo).toHaveBeenCalledWith(0, 0)
      expect(ctx.beginPath).toHaveBeenCalled()
      expect(ctx.closePath).toHaveBeenCalled()
      expect(result).toBe(ctx)
    })

    it('should handle equal width and height', () => {
      const roundRect = canvasRoundRect(ctx)
      roundRect(0, 0, 50, 50, 10)

      expect(ctx.moveTo).toHaveBeenCalledWith(10, 0)
      expect(ctx.arcTo).toHaveBeenCalledTimes(4)
    })

    it('should handle radius exactly at half of min dimension', () => {
      const roundRect = canvasRoundRect(ctx)
      roundRect(0, 0, 20, 10, 5)

      // Radius 5 equals min(20,10)/2 = 5, no clamping needed
      expect(ctx.moveTo).toHaveBeenCalledWith(5, 0)
    })

    it('should call arcTo with correct arguments', () => {
      const roundRect = canvasRoundRect(ctx)
      roundRect(10, 20, 100, 50, 5)

      // First arcTo: (x+w, y) -> (x+w, y+h)
      expect(ctx.arcTo).toHaveBeenCalledWith(110, 20, 110, 70, 5)
      // Second arcTo: (x+w, y+h) -> (x, y+h)
      expect(ctx.arcTo).toHaveBeenCalledWith(110, 70, 10, 70, 5)
      // Third arcTo: (x, y+h) -> (x, y)
      expect(ctx.arcTo).toHaveBeenCalledWith(10, 70, 10, 20, 5)
      // Fourth arcTo: (x, y) -> (x+w, y)
      expect(ctx.arcTo).toHaveBeenCalledWith(10, 20, 110, 20, 5)
    })
  })

  describe('loadImage', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should resolve with image on successful load', async () => {
      // Mock Image to call onload immediately
      const OriginalImage = (global as any).Image
      ;(global as any).Image = class {
        onload: (() => void) | null = null
        src: string = ''
        crossOrigin: string = ''

        setAttribute(name: string, value: string) {
          if (name === 'crossOrigin') {
            this.crossOrigin = value
          }
        }

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      }

      const image = await loadImage('test.png')
      expect(image).toBeDefined()
      expect(image.crossOrigin).toBe('anonymous')

      ;(global as any).Image = OriginalImage
    })

    it('should set custom crossOrigin', async () => {
      const OriginalImage = (global as any).Image
      ;(global as any).Image = class {
        onload: (() => void) | null = null
        src: string = ''
        crossOrigin: string = ''

        setAttribute(name: string, value: string) {
          if (name === 'crossOrigin') {
            this.crossOrigin = value
          }
        }

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      }

      const image = await loadImage('test.png', 'use-credentials')
      expect(image.crossOrigin).toBe('use-credentials')

      ;(global as any).Image = OriginalImage
    })

    it('should default crossOrigin to anonymous when not provided', async () => {
      const OriginalImage = (global as any).Image
      let capturedCrossOrigin: string = ''
      ;(global as any).Image = class {
        onload: (() => void) | null = null
        src: string = ''
        crossOrigin: string = ''

        setAttribute(name: string, value: string) {
          if (name === 'crossOrigin') {
            this.crossOrigin = value
            capturedCrossOrigin = value
          }
        }

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      }

      await loadImage('test.png')
      expect(capturedCrossOrigin).toBe('anonymous')

      ;(global as any).Image = OriginalImage
    })

    it('should set the src attribute on the image', async () => {
      const OriginalImage = (global as any).Image
      let capturedSrc: string = ''
      ;(global as any).Image = class {
        onload: (() => void) | null = null
        private _src: string = ''
        crossOrigin: string = ''

        get src() { return this._src }
        set src(val: string) {
          this._src = val
          capturedSrc = val
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }

        setAttribute(name: string, value: string) {
          if (name === 'crossOrigin') this.crossOrigin = value
        }
      }

      await loadImage('https://example.com/logo.png')
      expect(capturedSrc).toBe('https://example.com/logo.png')

      ;(global as any).Image = OriginalImage
    })

    it('should reject on image load error', async () => {
      const OriginalImage = (global as any).Image
      ;(global as any).Image = class {
        onerror: (() => void) | null = null
        src: string = ''

        setAttribute() {}

        constructor() {
          setTimeout(() => {
            if (this.onerror) this.onerror()
          }, 0)
        }
      }

      await expect(loadImage('invalid.png')).rejects.toBe('logo load fail!')

      ;(global as any).Image = OriginalImage
    })
  })

  describe('saveImage', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      // Mock dispatchEvent to accept any event
      HTMLAnchorElement.prototype.dispatchEvent = jest.fn(() => true)
    })

    it('should create a download link and trigger click', async () => {
      const mockImage = {
        src: 'data:image/png;base64,test'
      } as HTMLImageElement

      const result = await saveImage(mockImage, 'test.png')

      expect(result).toBe(true)
      expect(document.body.appendChild).toHaveBeenCalled()
      expect(document.body.removeChild).toHaveBeenCalled()
    })

    it('should set the correct download attribute name', async () => {
      const mockImage = {
        src: 'data:image/png;base64,test'
      } as HTMLImageElement

      const originalCreateElement = document.createElement.bind(document)
      const createdLinks: HTMLAnchorElement[] = []
      document.createElement = jest.fn((tag: string) => {
        const el = originalCreateElement(tag)
        if (tag === 'a') {
          createdLinks.push(el as HTMLAnchorElement)
        }
        return el
      }) as any

      await saveImage(mockImage, 'my-qr.png')

      expect(createdLinks.length).toBe(1)
      expect(createdLinks[0].download).toBe('my-qr.png')
      expect(createdLinks[0].href).toBe('data:image/png;base64,test')

      document.createElement = originalCreateElement
    })

    it('should dispatch a MouseEvent click', async () => {
      const mockImage = {
        src: 'data:image/png;base64,test'
      } as HTMLImageElement

      await saveImage(mockImage, 'test.png')

      expect(HTMLAnchorElement.prototype.dispatchEvent).toHaveBeenCalled()
      const dispatchedEvent = (HTMLAnchorElement.prototype.dispatchEvent as jest.Mock).mock.calls[0][0]
      expect(dispatchedEvent).toBeInstanceOf(MouseEvent)
    })

    it('should reject if an error occurs', async () => {
      const mockImage = {
        src: 'data:image/png;base64,test'
      } as HTMLImageElement

      const originalAppendChild = document.body.appendChild
      document.body.appendChild = jest.fn(() => {
        throw new Error('DOM error')
      }) as any

      await expect(saveImage(mockImage, 'test.png')).rejects.toThrow('DOM error')

      document.body.appendChild = originalAppendChild
    })
  })

  describe('toImage', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      HTMLAnchorElement.prototype.dispatchEvent = jest.fn(() => true)
    })

    it('should set image src from canvas data URL', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')
      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: false
      }

      await toImage(options)

      expect(mockImage.src).toBe('data:image/png;base64,test')
    })

    it('should throw if canvas is not provided', async () => {
      const options: BaseOptions = {
        content: 'test',
        download: false
      }

      await expect(toImage(options)).rejects.toThrow('Canvas element is required')
    })

    it('should not download if download is false', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')

      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: false
      }

      await toImage(options)
      expect(document.body.appendChild).not.toHaveBeenCalled()
    })

    it('should call download function if download is true', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')
      mockImage.src = 'data:image/png;base64,test'

      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: true,
        downloadName: 'test.png'
      }

      await toImage(options)

      expect(document.body.appendChild).toHaveBeenCalled()
    })

    it('should call custom download function if provided', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')
      const customDownload = jest.fn((start) => start())

      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: customDownload,
        downloadName: 'test.png'
      }

      await toImage(options)

      expect(customDownload).toHaveBeenCalled()
    })

    it('should throw if canvas toDataURL returns empty string', async () => {
      const mockCanvas = document.createElement('canvas')
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL
      HTMLCanvasElement.prototype.toDataURL = jest.fn(() => '')

      const mockImage = document.createElement('img')
      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: false
      }

      await expect(toImage(options)).rejects.toThrow('Can not get the canvas DataURL')

      HTMLCanvasElement.prototype.toDataURL = originalToDataURL
    })

    it('should not trigger download when download is a non-function truthy value', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')

      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: 'yes' as any,
        downloadName: 'test.png'
      }

      // download is not true and not a function, so it should return early
      await toImage(options)
      expect(document.body.appendChild).not.toHaveBeenCalled()
    })

    it('should pass startDownload callback to custom download function', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')
      mockImage.src = 'data:image/png;base64,test'

      let capturedStartFn: (() => Promise<void>) | null = null
      const customDownload = jest.fn(async (start: () => Promise<void>) => {
        capturedStartFn = start
      })

      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: customDownload,
        downloadName: 'test.png'
      }

      await toImage(options)

      expect(customDownload).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should work with undefined download option', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')

      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: undefined as any,
        downloadName: 'test.png'
      }

      await toImage(options)
      expect(mockImage.src).toBe('data:image/png;base64,test')
      expect(document.body.appendChild).not.toHaveBeenCalled()
    })

    it('should use setup MockImage for loadImage without crossOrigin', async () => {
      // Use the global MockImage from setup.ts (not a custom override)
      const image = await loadImage('test-setup.png')
      expect(image).toBeDefined()
      expect(image.src).toBe('test-setup.png')
    })

    it('should use setup MockImage for loadImage with crossOrigin', async () => {
      const image = await loadImage('test-setup.png', 'use-credentials')
      expect(image).toBeDefined()
      expect(image.crossOrigin).toBe('use-credentials')
    })

    it('should call toImage with download=true triggers saveImage', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')
      mockImage.src = 'data:image/png;base64,test'

      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: true,
        downloadName: 'myqr.png'
      }

      await toImage(options)
      expect(document.body.appendChild).toHaveBeenCalled()
    })

    it('should handle toImage with download as async function', async () => {
      const mockCanvas = document.createElement('canvas')
      const mockImage = document.createElement('img')
      const asyncDownload = jest.fn(async (start: () => Promise<void>) => {
        await start()
      })

      const options: BaseOptions = {
        content: 'test',
        canvas: mockCanvas,
        image: mockImage,
        download: asyncDownload,
        downloadName: 'async.png'
      }

      await toImage(options)
      expect(asyncDownload).toHaveBeenCalled()
      expect(document.body.appendChild).toHaveBeenCalled()
    })

    it('should handle canvasRoundRect with negative radius', () => {
      const ctx = document.createElement('canvas').getContext('2d')!
      jest.clearAllMocks()
      const roundRect = canvasRoundRect(ctx)
      const result = roundRect(10, 20, 100, 50, -5)

      // Negative radius is passed through (not clamped by canvasRoundRect)
      expect(ctx.beginPath).toHaveBeenCalled()
      expect(ctx.moveTo).toHaveBeenCalledWith(5, 20)
      expect(result).toBe(ctx)
    })

    it('should handle canvasRoundRect with very small dimensions', () => {
      const ctx = document.createElement('canvas').getContext('2d')!
      jest.clearAllMocks()
      const roundRect = canvasRoundRect(ctx)
      roundRect(0, 0, 1, 1, 10)

      // Radius clamped to min(1,1)/2 = 0.5
      expect(ctx.moveTo).toHaveBeenCalledWith(0.5, 0)
    })

    it('should handle getErrorCorrectionLevel at exact boundary of 36 chars', () => {
      expect(getErrorCorrectionLevel('a'.repeat(36))).toBe('Q')
      expect(getErrorCorrectionLevel('a'.repeat(37))).toBe('M')
    })

    it('should handle getErrorCorrectionLevel with very short content', () => {
      expect(getErrorCorrectionLevel('')).toBe('H')
      expect(getErrorCorrectionLevel('a')).toBe('H')
    })
  })
})
