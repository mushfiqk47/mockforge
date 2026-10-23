import { describe, expect, it } from "vitest"
import { dividerWidthAtPoint, focusAtPoint } from "../drag"

describe("drag geometry service", () => {
  describe("dividerWidthAtPoint", () => {
    const canvasRect = { left: 100, top: 50, width: 800, height: 600 }

    it("calculates percentage width from clientX relative to canvas", () => {
      // 500 is 400px from left 100. 400 / 800 = 50%
      expect(dividerWidthAtPoint({ clientX: 500, clientY: 200 }, canvasRect)).toBe(50)
    })

    it("clamps to minimum split width", () => {
      expect(dividerWidthAtPoint({ clientX: 100, clientY: 200 }, canvasRect)).toBe(25)
    })

    it("clamps to maximum split width", () => {
      expect(dividerWidthAtPoint({ clientX: 900, clientY: 200 }, canvasRect)).toBe(88)
    })

    it("handles zero width canvas gracefully", () => {
      expect(dividerWidthAtPoint({ clientX: 500, clientY: 200 }, { ...canvasRect, width: 0 })).toBe(25)
    })
  })

  describe("focusAtPoint", () => {
    const imageRect = { left: 0, top: 0, width: 200, height: 200 }
    const startFocus = { x: 50, y: 50 }
    const origin = { clientX: 100, clientY: 100 }

    it("shifts focus proportionally to pointer movement", () => {
      // Moving right by 20px on a 200px image is a 10% shift
      const result = focusAtPoint({ clientX: 120, clientY: 100 }, origin, startFocus, imageRect)
      expect(result.x).toBe(40)
      expect(result.y).toBe(50)
    })

    it("clamps focus to 0-100 range", () => {
      const result = focusAtPoint({ clientX: 300, clientY: 300 }, origin, startFocus, imageRect)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })
  })
})
