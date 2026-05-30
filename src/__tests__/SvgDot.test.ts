import SvgDot from '../core/SvgDot'

describe('SvgDot', () => {
  const color = '#000000'
  const dotSize = 10

  function createDot(type: string): SvgDot {
    return new SvgDot({ type: type as any, dotSize, color })
  }

  function svg(x = 0, y = 0, type = 'square', getNeighbor?: any): string {
    return createDot(type).draw(x, y, getNeighbor, undefined, 0, 0)
  }

  describe('square', () => {
    it('returns a rect element', () => {
      const result = svg(0, 0, 'square')
      expect(result).toContain('<rect')
      expect(result).toContain('fill="#000000"')
    })

    it('positions correctly with offset', () => {
      const result = svg(10, 20, 'square')
      expect(result).toContain('translate(15,25)')
    })
  })

  describe('dot', () => {
    it('returns a circle element', () => {
      const result = svg(0, 0, 'dot')
      expect(result).toContain('<circle')
      expect(result).toContain('r="4"') // dotSize * 0.4
    })
  })

  describe('dot-small', () => {
    it('returns a circle with smaller radius', () => {
      const result = svg(0, 0, 'dot-small')
      expect(result).toContain('<circle')
      expect(result).toContain('r="3"') // dotSize * 0.3
    })
  })

  describe('rounded', () => {
    it('returns a path with rounded corners', () => {
      const result = svg(0, 0, 'rounded')
      expect(result).toContain('<path')
      expect(result).toContain('A') // arc commands for roundedness
    })
  })

  describe('diamond', () => {
    it('returns a rotated rect', () => {
      const result = svg(0, 0, 'diamond')
      expect(result).toContain('rotate(45)')
    })
  })

  describe('star', () => {
    it('returns a path with quadratic curves', () => {
      const result = svg(0, 0, 'star')
      expect(result).toContain('<path')
      expect(result).toContain('Q') // quadratic curves
    })
  })

  describe('tile', () => {
    it('returns a rect with size-1', () => {
      const result = svg(0, 0, 'tile')
      expect(result).toContain('<rect')
      expect(result).toContain('width="9"')
    })
  })

  describe('fluid', () => {
    it('returns a group with circle', () => {
      const result = svg(0, 0, 'fluid')
      expect(result).toContain('<g')
      expect(result).toContain('<circle')
    })
  })

  describe('fluid-line', () => {
    it('returns a group with circle and possible extra paths', () => {
      const result = svg(0, 0, 'fluid-line')
      expect(result).toContain('<g')
      expect(result).toContain('<circle')
    })
  })

  describe('stripe', () => {
    it('handles default stripe grouping', () => {
      const qrData = {
        isDark: jest.fn(() => true),
        setDisabled: jest.fn(),
        isDisabled: jest.fn(() => false),
      }
      const dot = createDot('stripe')
      const result = dot.draw(0, 0, undefined, qrData, 0, 0)
      expect(result).toBeTruthy()
    })
  })

  describe('stripe-row', () => {
    it('handles row-oriented stripe', () => {
      const qrData = {
        isDark: jest.fn(() => true),
        setDisabled: jest.fn(),
        isDisabled: jest.fn(() => false),
      }
      const dot = createDot('stripe-row')
      const result = dot.draw(0, 0, undefined, qrData, 0, 0)
      expect(result).toBeTruthy()
    })
  })

  describe('stripe-column', () => {
    it('handles column-oriented stripe', () => {
      const qrData = {
        isDark: jest.fn(() => true),
        setDisabled: jest.fn(),
        isDisabled: jest.fn(() => false),
      }
      const dot = createDot('stripe-column')
      const result = dot.draw(0, 0, undefined, qrData, 0, 0)
      expect(result).toBeTruthy()
    })
  })
})
