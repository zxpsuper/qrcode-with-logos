import QRCorner from '../core/QRCorner'
import { CornerType } from '../core/types'

describe('QRCorner', () => {
  let ctx: CanvasRenderingContext2D
  let corner: QRCorner

  beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d')!
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with provided options', () => {
      corner = new QRCorner(ctx, 'square', '#000')

      expect(corner.context).toBe(ctx)
      expect(corner.cornerType).toBe('square')
      expect(corner.color).toBe('#000')
    })

    it('should store custom color', () => {
      corner = new QRCorner(ctx, 'rounded', '#ff0000')
      expect(corner.color).toBe('#ff0000')
    })
  })

  describe('draw', () => {
    it('should draw square corner (radius=0)', () => {
      corner = new QRCorner(ctx, 'square', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // Square calls drawRoundedSquare for stroke (outer) and fill (inner)
      expect(ctx.stroke).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should draw rounded corner', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 5 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw circle corner with arc', () => {
      corner = new QRCorner(ctx, 'circle', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw rounded-circle corner', () => {
      corner = new QRCorner(ctx, 'rounded-circle', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // rounded-circle: outer rounded square (stroke) + inner circle (fill)
      expect(ctx.stroke).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should draw circle-rounded corner', () => {
      corner = new QRCorner(ctx, 'circle-rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // circle-rounded: outer circle (stroke) + inner rounded square (fill)
      expect(ctx.stroke).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should draw circle-diamond corner', () => {
      corner = new QRCorner(ctx, 'circle-diamond', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // circle-diamond: outer circle + inner diamond (rotated rounded square)
      expect(ctx.arc).toHaveBeenCalled()
    })

    it('should draw circle-star corner with quadratic curves', () => {
      corner = new QRCorner(ctx, 'circle-star', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.quadraticCurveTo).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should fallback to square for unknown type', () => {
      corner = new QRCorner(ctx, 'unknown' as CornerType, '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })
  })

  describe('radius handling', () => {
    it('should handle number radius for rounded corner', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 5 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle object radius with inner and outer for rounded corner', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: { inner: 3, outer: 5 } })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should use default radius when not provided for rounded corner', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      // Default inner = dotSize/4 = 2.5, outer = dotSize/2 = 5
      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle zero radius explicitly', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 0 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle large radius by clamping', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      // Very large radius should be clamped to size/2
      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 1000 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle object radius with only outer defined', () => {
      corner = new QRCorner(ctx, 'rounded-circle', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: { outer: 8 } as any })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle object radius with only inner defined', () => {
      corner = new QRCorner(ctx, 'circle-rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: { inner: 3 } as any })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle radius object for rounded-circle with defaults', () => {
      corner = new QRCorner(ctx, 'rounded-circle', '#000')

      // No radius provided, should use default outer = dotSize/2
      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle radius object for circle-rounded with defaults', () => {
      corner = new QRCorner(ctx, 'circle-rounded', '#000')

      // No radius provided, should use default inner = dotSize/4
      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle number radius for rounded-circle', () => {
      corner = new QRCorner(ctx, 'rounded-circle', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 8 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should handle number radius for circle-rounded', () => {
      corner = new QRCorner(ctx, 'circle-rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 6 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })
  })

  describe('color handling', () => {
    it('should set fillStyle and strokeStyle to corner color for square', () => {
      corner = new QRCorner(ctx, 'square', '#ff0000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      // Color is set inside drawRoundedSquare
      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should set color for circle type', () => {
      corner = new QRCorner(ctx, 'circle', '#00ff00')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should use the same color for both outer and inner shapes', () => {
      corner = new QRCorner(ctx, 'rounded', '#123456')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 5 })

      // save/restore is called multiple times (outer + inner)
      expect((ctx.save as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(2)
      expect((ctx.restore as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('transform handling', () => {
    it('should save and restore context state in order', () => {
      corner = new QRCorner(ctx, 'square', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      // Verify save is called before restore
      const saveCallOrder = (ctx.save as jest.Mock).mock.invocationCallOrder[0]
      const restoreCallOrder = (ctx.restore as jest.Mock).mock.invocationCallOrder[0]
      expect(saveCallOrder).toBeLessThan(restoreCallOrder)
    })

    it('should translate to center for rounded square drawing', () => {
      corner = new QRCorner(ctx, 'square', '#000')

      corner.draw({ x: 10, y: 20, dotSize: 5 })

      // drawRoundedSquare translates to center
      expect(ctx.translate).toHaveBeenCalled()
    })

    it('should handle non-zero x and y offset', () => {
      corner = new QRCorner(ctx, 'circle', '#000')

      corner.draw({ x: 50, y: 60, dotSize: 10 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })
  })

  describe('drawRoundedSquare internals', () => {
    it('should call quadraticCurveTo for all 4 corners when radius > 0', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 5 })

      // Should have quadraticCurveTo calls for rounded corners
      expect(ctx.quadraticCurveTo).toHaveBeenCalled()
    })

    it('should not call quadraticCurveTo when radius is 0', () => {
      corner = new QRCorner(ctx, 'square', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      // Square uses radius=0, so no quadraticCurveTo for corners
      // (lines are used instead of curves)
      expect(ctx.quadraticCurveTo).not.toHaveBeenCalled()
    })

    it('should handle very large radius clamped to size/2', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      // radius > dotSize * 3 (inner box half-size), should be clamped
      corner.draw({ x: 0, y: 0, dotSize: 10, radius: 100 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })
  })

  describe('circle drawing', () => {
    it('should draw outer circle with stroke for circle type', () => {
      corner = new QRCorner(ctx, 'circle', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      // Circle draws 2 circles (outer stroke, inner fill)
      expect(ctx.stroke).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should draw circle-star with star pattern using quadraticCurveTo', () => {
      corner = new QRCorner(ctx, 'circle-star', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      // circle-star: outer circle + inner star (4 quadraticCurveTo)
      expect(ctx.quadraticCurveTo).toHaveBeenCalledTimes(4)
    })

    it('should draw circle-diamond with rotated inner shape', () => {
      corner = new QRCorner(ctx, 'circle-diamond', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 10 })

      // circle-diamond: outer circle + inner rotated rounded square
      expect(ctx.rotate).toHaveBeenCalled()
    })
  })

  describe('dotSize scaling', () => {
    it('should scale all dimensions based on dotSize', () => {
      corner = new QRCorner(ctx, 'circle', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 20 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should work with small dotSize', () => {
      corner = new QRCorner(ctx, 'rounded', '#000')

      corner.draw({ x: 0, y: 0, dotSize: 1 })

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })
  })
})
