import { describe, expect, it } from "vitest"
import {
  clamp,
  clampFocus,
  createDefaultSections,
  isDerivedSectionProperty,
  resizeSections,
  sliderProgress,
  stepSplitWidth,
  withLayoutProperty,
} from "../layout"
import {
  SPLIT_MAX_WIDTH,
  SPLIT_MIN_WIDTH,
} from "../constants"

describe("layout service", () => {
  describe("clamp", () => {
    it("restricts values below minimum", () => {
      expect(clamp(-5, 0, 100)).toBe(0)
    })

    it("restricts values above maximum", () => {
      expect(clamp(150, 0, 100)).toBe(100)
    })

    it("preserves values within range", () => {
      expect(clamp(42, 0, 100)).toBe(42)
    })
  })

  describe("clampFocus", () => {
    it("clamps both coordinates between 0 and 100", () => {
      expect(clampFocus({ x: -10, y: 120 })).toEqual({ x: 0, y: 100 })
      expect(clampFocus({ x: 50, y: 50 })).toEqual({ x: 50, y: 50 })
    })
  })

  describe("sliderProgress", () => {
    it("calculates percentage progress accurately", () => {
      expect(sliderProgress(50, 0, 100)).toBe(50)
      expect(sliderProgress(25, 0, 100)).toBe(25)
      expect(sliderProgress(10, 10, 10)).toBe(0)
    })
  })

  describe("stepSplitWidth", () => {
    it("increments and decrements split width within bounds", () => {
      expect(stepSplitWidth(50, 1)).toBe(52)
      expect(stepSplitWidth(50, -1)).toBe(48)
      expect(stepSplitWidth(SPLIT_MAX_WIDTH, 1)).toBe(SPLIT_MAX_WIDTH)
      expect(stepSplitWidth(SPLIT_MIN_WIDTH, -1)).toBe(SPLIT_MIN_WIDTH)
    })
  })

  describe("isDerivedSectionProperty", () => {
    it("marks width and x as derived for section 2 (index 1)", () => {
      expect(isDerivedSectionProperty(1, "width")).toBe(true)
      expect(isDerivedSectionProperty(1, "x")).toBe(true)
      expect(isDerivedSectionProperty(1, "height")).toBe(false)
      expect(isDerivedSectionProperty(0, "width")).toBe(false)
    })
  })

  describe("resizeSections", () => {
    it("updates section 1 and re-links section 2 correctly", () => {
      const initial = createDefaultSections()
      const updated = resizeSections(initial, 0, {
        ...initial[0],
        width: 60,
      })

      expect(updated[0].width).toBe(60)
      // Section 2 should start after section 1 + gap
      expect(updated[1].x).toBe(60 + 2)
      expect(updated[1].width).toBe(100 - 62)
    })

    it("leaves section 1 untouched when modifying section 2 height", () => {
      const initial = createDefaultSections()
      const updated = resizeSections(initial, 1, {
        ...initial[1],
        height: 80,
      })

      expect(updated[0]).toBe(initial[0])
      expect(updated[1].height).toBe(80)
    })
  })

  describe("withLayoutProperty", () => {
    it("creates a new section layout object with updated property", () => {
      const section = { x: 10, y: 20, width: 30, height: 40 }
      const next = withLayoutProperty(section, "width", 50)
      expect(next).toEqual({ x: 10, y: 20, width: 50, height: 40 })
      expect(section.width).toBe(30)
    })
  })
})
