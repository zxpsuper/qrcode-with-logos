import SvgCorner from '../core/SvgCorner'

describe('SvgCorner', () => {
  const color = '#000000'
  const dotSize = 10

  function svg(type: string, radius?: any): string {
    const corner = new SvgCorner(type as any, color)
    return corner.draw({ x: 0, y: 0, dotSize, radius })
  }

  function hasOuterRect(result: string): boolean {
    return result.includes('translate') && (result.includes('fill="none"') || result.includes('fill="#000000"'))
  }

  describe('square', () => {
    it('returns outer and inner rects', () => {
      const result = svg('square')
      expect(result).toContain('<path')
      // Should have stroke for outer, fill for inner
      expect(result).toContain('stroke="#000000"')
    })
  })

  describe('rounded', () => {
    it('returns rounded rects', () => {
      const result = svg('rounded', 5)
      expect(result).toContain('<path')
      expect(result).toContain('A')
    })

    it('accepts object radius', () => {
      const result = svg('rounded', { inner: 3, outer: 5 })
      expect(result).toBeTruthy()
    })
  })

  describe('circle', () => {
    it('returns circle elements', () => {
      const result = svg('circle')
      expect(result).toContain('<circle')
      expect(result).toContain('fill="none"')
    })
  })

  describe('rounded-circle', () => {
    it('combines rounded outer and circle inner', () => {
      const result = svg('rounded-circle', 5)
      expect(result).toContain('<path')
      expect(result).toContain('<circle')
    })
  })

  describe('circle-rounded', () => {
    it('combines circle outer and rounded inner', () => {
      const result = svg('circle-rounded', 3)
      expect(result).toContain('<circle')
      expect(result).toContain('<path')
    })
  })

  describe('circle-diamond', () => {
    it('combines circle outer and diamond inner', () => {
      const result = svg('circle-diamond')
      expect(result).toContain('<circle')
      expect(result).toContain('rotate(45)')
    })
  })

  describe('circle-star', () => {
    it('combines circle outer and star inner', () => {
      const result = svg('circle-star')
      expect(result).toContain('<circle')
      expect(result).toContain('<path')
    })
  })
})
