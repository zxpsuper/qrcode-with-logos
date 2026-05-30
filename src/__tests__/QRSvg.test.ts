// QRSvg tests — mock qrcode to control QR data, test SVG output.
// Canvas/Image are mocked via the global setup.

jest.mock('qrcode', () => {
  const size = 21
  const data = new Array(size * size).fill(0).map((_: any, i: number) => {
    const row = Math.floor(i / size)
    const col = i % size
    if (row < 7 && col < 7) return 1
    if (row > 14 && col < 7) return 1
    if (row < 7 && col > 14) return 1
    return 0
  })
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => ({
        modules: { size, data },
        version: 1,
      })),
    },
  }
})

import { QRSvg } from '../core/QRSvg'

describe('QRSvg', () => {
  describe('basic SVG generation', () => {
    it('generates valid SVG string with default options', async () => {
      const qrSvg = new QRSvg({ content: 'hello' })
      const svg = await qrSvg.init()
      expect(svg).toContain('<svg')
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(svg).toContain('viewBox="0 0 380 380"')
      expect(svg).toContain('</svg>')
    })

    it('generates SVG with custom width', async () => {
      const qrSvg = new QRSvg({ content: 'hello', width: 500 })
      const svg = await qrSvg.init()
      expect(svg).toContain('viewBox="0 0 500 500"')
    })

    it('includes background rect', async () => {
      const qrSvg = new QRSvg({ content: 'hello' })
      const svg = await qrSvg.init()
      // Background is a rect filling the whole canvas
      expect(svg).toContain('<rect')
    })
  })

  describe('dot types', () => {
    const dotTypes = [
      'square', 'dot', 'dot-small', 'rounded', 'diamond', 'star',
      'tile', 'fluid', 'fluid-line', 'stripe', 'stripe-row', 'stripe-column',
    ] as const

    dotTypes.forEach((type) => {
      it(`renders dot type "${type}"`, async () => {
        const qrSvg = new QRSvg({
          content: 'hello',
          dotsOptions: { type },
        })
        const svg = await qrSvg.init()
        expect(svg).toContain('<svg')
        // Should contain path, rect, or circle elements for dots
        expect(svg.length).toBeGreaterThan(100)
      })
    })
  })

  describe('corner types', () => {
    const cornerTypes = [
      'square', 'rounded', 'circle', 'rounded-circle',
      'circle-rounded', 'circle-diamond', 'circle-star',
    ] as const

    cornerTypes.forEach((type) => {
      it(`renders corner type "${type}"`, async () => {
        const qrSvg = new QRSvg({
          content: 'hello',
          cornersOptions: { type },
        })
        const svg = await qrSvg.init()
        expect(svg).toContain('<svg')
      })
    })
  })

  describe('custom options', () => {
    it('applies custom corner color', async () => {
      const qrSvg = new QRSvg({
        content: 'hello',
        cornersOptions: { color: '#00ff00' },
      })
      const svg = await qrSvg.init()
      expect(svg).toContain('#00ff00')
    })

    it('applies background color', async () => {
      const qrSvg = new QRSvg({
        content: 'hello',
        nodeQrCodeOptions: { color: { light: '#ffeeee' } },
      })
      const svg = await qrSvg.init()
      expect(svg).toContain('#ffeeee')
    })

    it('applies corner radius', async () => {
      const qrSvg = new QRSvg({
        content: 'hello',
        cornersOptions: { type: 'rounded', radius: 5 },
      })
      const svg = await qrSvg.init()
      expect(svg).toContain('<svg')
    })
  })

  describe('logo', () => {
    it('works with logo as string', async () => {
      const qrSvg = new QRSvg({
        content: 'hello',
        logo: 'https://example.com/logo.png',
      })
      const svg = await qrSvg.init()
      expect(svg).toContain('<image')
      expect(svg).toContain('href')
    })

    it('works with logo as object', async () => {
      const qrSvg = new QRSvg({
        content: 'hello',
        logo: {
          src: 'https://example.com/logo.png',
          borderRadius: 10,
          bgColor: '#ff0000',
        },
      })
      const svg = await qrSvg.init()
      expect(svg).toContain('<image')
    })

    it('works without logo', async () => {
      const qrSvg = new QRSvg({ content: 'hello' })
      const svg = await qrSvg.init()
      // Should still generate valid SVG
      expect(svg).toContain('<svg')
    })
  })

  describe('error handling', () => {
    it('throws when qrcode creation fails', () => {
      const QRCodeModule = require('qrcode')
      QRCodeModule.default.create.mockImplementationOnce(() => {
        throw new Error('No input text')
      })
      expect(() => new QRSvg({ content: '' })).toThrow('No input text')
    })
  })

  describe('QR data access', () => {
    it('isDark returns correct values', () => {
      const qrSvg = new QRSvg({ content: 'hello' })
      // Some cells should be dark (1) and some light (0) in a real QR code
      const hasDark = Array.from({ length: 21 }, (_, i) =>
        Array.from({ length: 21 }, (_, j) => qrSvg.isDark(i, j))
      ).some(row => row.some(Boolean))
      expect(hasDark).toBe(true)
    })

    it('isDisabled returns false initially', () => {
      const qrSvg = new QRSvg({ content: 'hello' })
      expect(qrSvg.isDisabled(0, 0)).toBe(false)
    })

    it('setDisabled marks cells as disabled', () => {
      const qrSvg = new QRSvg({ content: 'hello' })
      qrSvg.setDisabled(0, 0)
      expect(qrSvg.isDisabled(0, 0)).toBe(true)
    })
  })
})
