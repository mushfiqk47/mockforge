import { describe, expect, it } from "vitest"
import { createInitialMockupState, mockupReducer } from "../mockupState"

describe("mockupState reducer", () => {
  it("creates initial state with single hero mode and empty images", () => {
    const state = createInitialMockupState()
    expect(state.mode).toBe("single")
    expect(state.images).toEqual([])
    expect(state.activeSection).toBe(0)
    expect(state.frame.type).toBe("browser")
  })

  it("handles mode/set action", () => {
    const initial = createInitialMockupState()
    const updated = mockupReducer(initial, { type: "mode/set", mode: "split" })
    expect(updated.mode).toBe("split")
  })

  it("handles images/replace and images/remove actions", () => {
    const initial = createInitialMockupState()
    const withImages = mockupReducer(initial, {
      type: "images/replace",
      urls: ["blob:image-1", "blob:image-2"],
    })
    expect(withImages.images).toEqual(["blob:image-1", "blob:image-2"])

    const removed = mockupReducer(withImages, {
      type: "images/remove",
      index: 0,
    })
    expect(removed.images).toEqual(["blob:image-2"])
  })

  it("handles focus/set action and clamps values", () => {
    const initial = createInitialMockupState()
    const updated = mockupReducer(initial, {
      type: "focus/set",
      section: 0,
      focus: { x: 150, y: -20 },
    })
    expect(updated.focus.primary).toEqual({ x: 100, y: 0 })
  })

  it("handles appearance/update and frame/update patches", () => {
    const initial = createInitialMockupState()
    const withAppearance = mockupReducer(initial, {
      type: "appearance/update",
      patch: { darkTheme: false, canvasPadding: 48 },
    })
    expect(withAppearance.appearance.darkTheme).toBe(false)
    expect(withAppearance.appearance.canvasPadding).toBe(48)

    const withFrame = mockupReducer(withAppearance, {
      type: "frame/update",
      patch: { type: "mobile", finish: "silver" },
    })
    expect(withFrame.frame.type).toBe("mobile")
    expect(withFrame.frame.finish).toBe("silver")
  })
})
