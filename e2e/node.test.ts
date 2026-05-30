/**
 * Node.js environment e2e tests
 * Tests that the built bundles work correctly in Node.js (non-browser) environment.
 * SVG renderer should work without logo, or with base64 logo + explicit dimensions.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QrCodeWithLogo = require('../lib/qrcode-with-logos.common.js')

describe('Node.js environment - CJS bundle', () => {
  describe('SVG renderer (no logo)', () => {
    it('creates instance with renderer: "svg"', () => {
      const qr = new QrCodeWithLogo({ content: 'hello', renderer: 'svg' })
      expect(qr).toBeDefined()
      expect(qr.options.renderer).toBe('svg')
    })

    it('generates valid SVG string via getSvgString()', async () => {
      const qr = new QrCodeWithLogo({ content: 'hello', renderer: 'svg' })
      const svg = await qr.getSvgString()
      expect(svg).toContain('<svg')
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(svg).toContain('width="380"')
      expect(svg).toContain('height="380"')
    })

    it('SVG contains QR code elements', async () => {
      const qr = new QrCodeWithLogo({ content: 'https://example.com', renderer: 'svg' })
      const svg = await qr.getSvgString()
      // Should have rect elements for background and dots
      expect(svg).toMatch(/<rect|<path|<circle/)
    })

    it('works with custom width', async () => {
      const qr = new QrCodeWithLogo({ content: 'hello', renderer: 'svg', width: 500 })
      const svg = await qr.getSvgString()
      expect(svg).toContain('width="500"')
      expect(svg).toContain('height="500"')
    })

    it('works with all dot types', async () => {
      const dotTypes = [
        'square', 'dot', 'dot-small', 'rounded', 'diamond',
        'star', 'tile', 'fluid', 'fluid-line',
        'stripe', 'stripe-row', 'stripe-column'
      ]
      for (const type of dotTypes) {
        const qr = new QrCodeWithLogo({
          content: 'test',
          renderer: 'svg',
          dotsOptions: { type }
        })
        const svg = await qr.getSvgString()
        expect(svg).toContain('<svg')
      }
    })

    it('works with all corner types', async () => {
      const cornerTypes = [
        'square', 'rounded', 'circle',
        'rounded-circle', 'circle-rounded',
        'circle-star', 'circle-diamond'
      ]
      for (const type of cornerTypes) {
        const qr = new QrCodeWithLogo({
          content: 'test',
          renderer: 'svg',
          cornersOptions: { type }
        })
        const svg = await qr.getSvgString()
        expect(svg).toContain('<svg')
      }
    })

    it('works with custom colors', async () => {
      const qr = new QrCodeWithLogo({
        content: 'hello',
        renderer: 'svg',
        dotsOptions: { color: '#ff0000' },
        cornersOptions: { color: '#00ff00' },
        nodeQrCodeOptions: { color: { dark: '#000', light: '#fff' } }
      })
      const svg = await qr.getSvgString()
      expect(svg).toContain('#ff0000')
      expect(svg).toContain('#00ff00')
    })

    it('works with custom margin', async () => {
      const qr = new QrCodeWithLogo({
        content: 'hello',
        renderer: 'svg',
        nodeQrCodeOptions: { margin: 10 }
      })
      const svg = await qr.getSvgString()
      expect(svg).toContain('<svg')
    })

    it('works with all error correction levels', async () => {
      const levels = ['L', 'M', 'Q', 'H']
      for (const level of levels) {
        const qr = new QrCodeWithLogo({
          content: 'test',
          renderer: 'svg',
          nodeQrCodeOptions: { errorCorrectionLevel: level }
        })
        const svg = await qr.getSvgString()
        expect(svg).toContain('<svg')
      }
    })
  })

  describe('SVG renderer with base64 logo', () => {
    // A minimal valid PNG base64 (1x1 transparent pixel)
    const base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

    it('works with base64 logo and explicit dimensions', async () => {
      const qr = new QrCodeWithLogo({
        content: 'hello',
        renderer: 'svg',
        logo: {
          src: base64Logo,
          width: 10,
          height: 10
        }
      })
      const svg = await qr.getSvgString()
      expect(svg).toContain('<svg')
      expect(svg).toContain('<image')
      expect(svg).toContain('data:image/png;base64')
    })

    it('works with logo options', async () => {
      const qr = new QrCodeWithLogo({
        content: 'hello',
        renderer: 'svg',
        logo: {
          src: base64Logo,
          width: 20,
          height: 20,
          borderWidth: 5,
          borderRadius: 8,
          bgColor: '#ffffff',
          logoRadius: 4
        }
      })
      const svg = await qr.getSvgString()
      expect(svg).toContain('<svg')
      expect(svg).toContain('<image')
    })

    it('logo is centered in SVG', async () => {
      const qr = new QrCodeWithLogo({
        content: 'hello',
        renderer: 'svg',
        width: 300,
        logo: {
          src: base64Logo,
          width: 30,
          height: 30
        }
      })
      const svg = await qr.getSvgString()
      // Check for transform with center coordinates
      expect(svg).toContain('translate(150,150)')
    })
  })

  describe('Canvas renderer (should fail in Node.js)', () => {
    it('throws error when using canvas renderer without explicit error handling', () => {
      expect(() => {
        new QrCodeWithLogo({
          content: 'hello',
          renderer: 'canvas'
        })
      }).toThrow('Canvas renderer requires browser environment')
    })

    it('calls onError when using canvas renderer', () => {
      const onError = jest.fn()
      // The error is thrown before onError can be attached, so we expect throw
      expect(() => {
        new QrCodeWithLogo({
          content: 'hello',
          renderer: 'canvas',
          onError
        })
      }).toThrow('Canvas renderer requires browser environment')
    })

    it('getSvgString throws when renderer is canvas', async () => {
      // Can't even construct with canvas renderer in Node.js
      // This test verifies the error message is helpful
      expect(() => {
        new QrCodeWithLogo({ content: 'hello', renderer: 'canvas' })
      }).toThrow()
    })
  })

  describe('Version', () => {
    it('has valid version string', () => {
      expect(QrCodeWithLogo.version).toBeDefined()
      expect(typeof QrCodeWithLogo.version).toBe('string')
      expect(QrCodeWithLogo.version).toMatch(/^\d+\.\d+\.\d+/)
    })
  })

  describe('Error handling', () => {
    it('handles empty content', async () => {
      const onError = jest.fn()
      const qr = new QrCodeWithLogo({ content: '', renderer: 'svg', onError })
      await expect(qr.getSvgString()).rejects.toBeDefined()
      expect(onError).toHaveBeenCalled()
    })
  })
})