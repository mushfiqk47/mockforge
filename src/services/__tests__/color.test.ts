import { describe, expect, it } from "vitest"
import { isLightColor } from "../color"

describe("color service", () => {
  it("recognizes pure white and light gray presets as light", () => {
    expect(isLightColor("#ffffff")).toBe(true)
    expect(isLightColor("#fff")).toBe(true)
    expect(isLightColor("#f3f4f6")).toBe(true)
  })

  it("recognizes dark colors and black as not light", () => {
    expect(isLightColor("#000000")).toBe(false)
    expect(isLightColor("#111111")).toBe(false)
    expect(isLightColor("#18181b")).toBe(false)
  })

  it("treats gradients and image url backgrounds as dark", () => {
    expect(isLightColor("linear-gradient(135deg, #fff, #000)")).toBe(false)
    expect(isLightColor("radial-gradient(circle, #fff, #000)")).toBe(false)
    expect(isLightColor("url(data:image/png;base64,...)")).toBe(false)
  })

  it("handles empty or unparsable color strings gracefully", () => {
    expect(isLightColor("")).toBe(false)
  })
})
