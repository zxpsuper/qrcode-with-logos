import { wrapSvg, svgRect, svgCircle, svgPath, svgGroup, roundRectPath } from '../core/svgUtils'

describe('svgUtils', () => {
  describe('wrapSvg', () => {
    it('wraps body in svg tag with correct attributes', () => {
      const result = wrapSvg('<rect/>', 380)
      expect(result).toContain('<svg')
      expect(result).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(result).toContain('viewBox="0 0 380 380"')
      expect(result).toContain('width="380"')
      expect(result).toContain('height="380"')
      expect(result).toContain('</svg>')
      expect(result).toContain('<rect/>')
    })
  })

  describe('svgRect', () => {
    it('creates rect element with correct coordinates', () => {
      const result = svgRect(10, 20, 100, 50)
      expect(result).toContain('<rect')
      expect(result).toContain('x="10"')
      expect(result).toContain('y="20"')
      expect(result).toContain('width="100"')
      expect(result).toContain('height="50"')
      expect(result).toMatch(/\/>$/)
    })

    it('includes extra attributes', () => {
      const result = svgRect(0, 0, 10, 10, { fill: '#ff0000', rx: '5' })
      expect(result).toContain('fill="#ff0000"')
      expect(result).toContain('rx="5"')
    })
  })

  describe('svgCircle', () => {
    it('creates circle element with correct attributes', () => {
      const result = svgCircle(50, 50, 20)
      expect(result).toContain('<circle')
      expect(result).toContain('cx="50"')
      expect(result).toContain('cy="50"')
      expect(result).toContain('r="20"')
    })
  })

  describe('svgPath', () => {
    it('creates path element with d attribute', () => {
      const result = svgPath('M0 0L10 10Z')
      expect(result).toContain('<path')
      expect(result).toContain('d="M0 0L10 10Z"')
    })
  })

  describe('svgGroup', () => {
    it('wraps children in g tag', () => {
      const result = svgGroup('<rect/>', { fill: '#000' })
      expect(result).toContain('<g')
      expect(result).toContain('fill="#000"')
      expect(result).toContain('<rect/>')
      expect(result).toContain('</g>')
    })
  })

  describe('roundRectPath', () => {
    it('generates a rect path with no radius', () => {
      const d = roundRectPath(0, 0, 10, 10, [0, 0, 0, 0])
      expect(d).toMatch(/^M/)
      expect(d).toMatch(/Z$/)
      // No arc commands for zero radius
      expect(d).not.toContain('A')
    })

    it('generates rounded corners with uniform radius', () => {
      const d = roundRectPath(0, 0, 10, 10, [3, 3, 3, 3])
      expect(d).toContain('A')
    })

    it('caps radius at half min dimension', () => {
      const d = roundRectPath(0, 0, 10, 10, [100, 100, 100, 100])
      // Should not crash, radius capped at 5
      expect(d).toContain('A')
    })
  })
})
