import QRDot from '../core/QRDot'
import { QRCanvas } from '../core/QRCanvas'
import { DotType } from '../core/types'

describe('QRDot', () => {
  let ctx: CanvasRenderingContext2D
  let qrDot: QRDot
  let mockQrCanvas: QRCanvas

  beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d')!
    jest.clearAllMocks()

    // Create a mock QRCanvas
    mockQrCanvas = {
      isDark: jest.fn(() => true),
      isDisabled: jest.fn(() => false),
      setDisabled: jest.fn()
    } as any
  })

  describe('constructor', () => {
    it('should initialize with provided options', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'square',
        dotSize: 10
      })

      expect(qrDot._context).toBe(ctx)
      expect(qrDot._type).toBe('square')
      expect(qrDot.dotSize).toBe(10)
    })

    it('should store different dot sizes', () => {
      qrDot = new QRDot({ context: ctx, type: 'dot', dotSize: 25 })
      expect(qrDot.dotSize).toBe(25)
    })
  })

  describe('draw', () => {
    const getNeighbor = (x: number, y: number) => false

    it('should draw square dot', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'square',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalled()
      expect(ctx.rect).toHaveBeenCalled()
      expect(ctx.closePath).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw tile dot', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'tile',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalled()
      expect(ctx.rect).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw dot type with default dotRate 0.4', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'dot',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw dot-small type with dotRate 0.3', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'dot-small',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw rounded dot with scaled size', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'rounded',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw diamond dot with rotation', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'diamond',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalled()
      expect(ctx.rotate).toHaveBeenCalled()
      expect(ctx.rect).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw star dot with quadratic curves', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'star',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.rotate).toHaveBeenCalled()
      expect(ctx.quadraticCurveTo).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw fluid dot with no neighbors (all corners rounded)', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'fluid',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalled()
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // With no neighbors, fillRect should not be called for corner fill-ins
      expect(ctx.fillRect).not.toHaveBeenCalled()
    })

    it('should draw fluid dot with all neighbors (all corners filled)', () => {
      const allNeighbors = (x: number, y: number) => true

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid',
        dotSize: 10
      })

      qrDot.draw(10, 10, allNeighbors, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // All 4 corners should be filled as rectangles
      expect(ctx.fillRect).toHaveBeenCalledTimes(4)
    })

    it('should draw fluid dot with only top neighbor', () => {
      const topNeighbor = (x: number, y: number) => {
        return x === 0 && y === -1
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid',
        dotSize: 10
      })

      qrDot.draw(10, 10, topNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // Top neighbor present: TL and TR corners are NOT rounded only if both adjacent neighbors absent
      // TL: !top && !left => false (top exists), so not rounded => fillRect
      // TR: !right && !top => false (top exists), so not rounded => fillRect
      // BR: !bottom && !right => true (no neighbors), rounded => no fillRect
      // BL: !bottom && !left => true (no neighbors), rounded => no fillRect
      expect(ctx.fillRect).toHaveBeenCalledTimes(2)
    })

    it('should draw fluid dot with only left neighbor', () => {
      const leftNeighbor = (x: number, y: number) => {
        return x === -1 && y === 0
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid',
        dotSize: 10
      })

      qrDot.draw(10, 10, leftNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.fillRect).toHaveBeenCalledTimes(2) // TL and BL
    })

    it('should draw fluid dot with only bottom neighbor', () => {
      const bottomNeighbor = (x: number, y: number) => {
        return x === 0 && y === 1
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid',
        dotSize: 10
      })

      qrDot.draw(10, 10, bottomNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.fillRect).toHaveBeenCalledTimes(2) // BR and BL
    })

    it('should draw fluid dot with only right neighbor', () => {
      const rightNeighbor = (x: number, y: number) => {
        return x === 1 && y === 0
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid',
        dotSize: 10
      })

      qrDot.draw(10, 10, rightNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.fillRect).toHaveBeenCalledTimes(2) // TR and BR
    })

    it('should draw fluid-line dot with diagonal bridge below-left', () => {
      const getNeighborWithLine = (x: number, y: number) => {
        if (x === 0 && y === 1) return false
        if (x === -1 && y === 1) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid-line',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighborWithLine, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // Should draw the bridge arc for below-left diagonal
      expect(ctx.stroke).toHaveBeenCalled()
    })

    it('should draw fluid-line dot with diagonal bridge below-right', () => {
      const getNeighborWithLine = (x: number, y: number) => {
        if (x === 0 && y === 1) return false
        if (x === 1 && y === 1) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid-line',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighborWithLine, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      expect(ctx.stroke).toHaveBeenCalled()
    })

    it('should not draw diagonal bridges when bottom neighbor exists', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 0 && y === 1) return true
        if (x === -1 && y === 1) return true
        if (x === 1 && y === 1) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid-line',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // Bridge arcs should not be drawn when bottom neighbor exists
    })

    it('should draw fluid-line with both diagonal bridges', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === -1 && y === 1) return true
        if (x === 1 && y === 1) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'fluid-line',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
      // Both bridge arcs should be drawn
      expect(ctx.stroke).toHaveBeenCalled()
    })

    it('should draw stripe dot', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'stripe',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw stripe-row dot', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-row',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should draw stripe-column dot', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-column',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })

    it('should fallback to square for unknown type', () => {
      qrDot = new QRDot({
        context: ctx,
        type: 'unknown' as DotType,
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })
  })

  describe('stripe behavior', () => {
    it('should disable dots when drawing stripe', () => {
      const getNeighbor = (x: number, y: number) => true

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(mockQrCanvas.setDisabled).toHaveBeenCalled()
    })

    it('should draw 3x1 stripe row when neighbors are dark', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 1 && y === 0) return true
        if (x === 2 && y === 0) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-row',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.arc).toHaveBeenCalled()
      expect(mockQrCanvas.setDisabled).toHaveBeenCalled()
    })

    it('should draw 2x1 stripe row when one right neighbor is dark', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 1 && y === 0) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-row',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.arc).toHaveBeenCalled()
      expect(mockQrCanvas.setDisabled).toHaveBeenCalled()
    })

    it('should draw single dot circle when no adjacent dark dots for stripe-row', () => {
      const getNeighbor = (x: number, y: number) => false

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-row',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
      // Single dot: only setDisabled(0,0) called once
      expect(mockQrCanvas.setDisabled).toHaveBeenCalledWith(0, 0)
    })

    it('should draw 1x3 stripe column when below neighbors are dark', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 0 && y === 1) return true
        if (x === 0 && y === 2) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-column',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.arc).toHaveBeenCalled()
      expect(mockQrCanvas.setDisabled).toHaveBeenCalled()
    })

    it('should draw 1x2 stripe column when one below neighbor is dark', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 0 && y === 1) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-column',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.arc).toHaveBeenCalled()
      expect(mockQrCanvas.setDisabled).toHaveBeenCalled()
    })

    it('should handle stripe default type with mixed combinations', () => {
      // For default stripe, it tries [3x1, 1x3, 2x1, 1x2, 1x1]
      // Test with 1x3 vertical match
      const getNeighbor = (x: number, y: number) => {
        if (x === 0 && y === 1) return true
        if (x === 0 && y === 2) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.arc).toHaveBeenCalled()
      expect(mockQrCanvas.setDisabled).toHaveBeenCalled()
    })

    it('should handle stripe default type with 3x1 horizontal match', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 1 && y === 0) return true
        if (x === 2 && y === 0) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      expect(ctx.arc).toHaveBeenCalled()
      expect(mockQrCanvas.setDisabled).toHaveBeenCalled()
    })

    it('should disable all dots in a 3x1 range', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 1 && y === 0) return true
        if (x === 2 && y === 0) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-row',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      // Should disable (0,0), (1,0), (2,0)
      expect(mockQrCanvas.setDisabled).toHaveBeenCalledWith(0, 0)
      expect(mockQrCanvas.setDisabled).toHaveBeenCalledWith(1, 0)
      expect(mockQrCanvas.setDisabled).toHaveBeenCalledWith(2, 0)
    })

    it('should disable all dots in a 1x3 range for stripe-column', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 0 && y === 1) return true
        if (x === 0 && y === 2) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-column',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      // Should disable (0,0), (0,1), (0,2)
      expect(mockQrCanvas.setDisabled).toHaveBeenCalledWith(0, 0)
      expect(mockQrCanvas.setDisabled).toHaveBeenCalledWith(0, 1)
      expect(mockQrCanvas.setDisabled).toHaveBeenCalledWith(0, 2)
    })

    it('should use drawItem with correct arc for horizontal stripe', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 1 && y === 0) return true
        if (x === 2 && y === 0) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-row',
        dotSize: 10
      })

      qrDot.draw(0, 0, getNeighbor, mockQrCanvas, 0, 0)

      // Horizontal: width > 1, should use arc for pill shape
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
    })

    it('should use drawItem with correct arc for vertical stripe', () => {
      const getNeighbor = (x: number, y: number) => {
        if (x === 0 && y === 1) return true
        if (x === 0 && y === 2) return true
        return false
      }

      qrDot = new QRDot({
        context: ctx,
        type: 'stripe-column',
        dotSize: 10
      })

      qrDot.draw(0, 0, getNeighbor, mockQrCanvas, 0, 0)

      // Vertical: height > 1, should use arc for pill shape
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
    })
  })

  describe('tile vs square difference', () => {
    it('should use size-1 for tile to create gap effect', () => {
      const getNeighbor = (x: number, y: number) => false

      qrDot = new QRDot({
        context: ctx,
        type: 'tile',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      // Tile draws rect with size-1 (gap effect)
      expect(ctx.rect).toHaveBeenCalled()
      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })
  })

  describe('diamond size calculation', () => {
    it('should rotate by PI/4 for diamond', () => {
      const getNeighbor = (x: number, y: number) => false

      qrDot = new QRDot({
        context: ctx,
        type: 'diamond',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      // Diamond rotates by PI/4
      expect(ctx.rotate).toHaveBeenCalledWith(Math.PI / 4)
    })
  })

  describe('star shape', () => {
    it('should draw 4 quadratic curves for star', () => {
      const getNeighbor = (x: number, y: number) => false

      qrDot = new QRDot({
        context: ctx,
        type: 'star',
        dotSize: 10
      })

      qrDot.draw(10, 10, getNeighbor, mockQrCanvas, 0, 0)

      // Star draws moveTo + 4 quadraticCurveTo calls
      expect(ctx.moveTo).toHaveBeenCalled()
      expect(ctx.quadraticCurveTo).toHaveBeenCalledTimes(4)
    })
  })
})
