/**
 * Domain types for the MockForge mockup builder.
 *
 * These describe the whole editable document: hero mode, uploaded images,
 * section layout, crop focus and the appearance/frame settings.
 */

export type Mode = "single" | "split"

/** Object-position of a photo inside its frame, in percent. */
export type CropFocus = {
  x: number
  y: number
}

/** Position and size of one hero section, in canvas percent. */
export type SectionLayout = {
  x: number
  y: number
  width: number
  height: number
}

export type FrameType =
  | "browser"
  | "mobile"
  | "laptop"
  | "tablet"
  | "monitor"
  | "none"
export type FrameFinish = "dark" | "silver" | "midnight"
export type FrameRatio = "auto" | "16-9" | "9-16" | "1-1" | "4-3"
export type FrameShadow = "deep" | "soft" | "glow" | "none"

/** Settings for the canvas surface behind the frame. */
export type AppearanceSettings = {
  canvasBackground: string
  canvasPadding: number
  sectionRadius: number
  darkTheme: boolean
}

/** Settings for the device frame chrome around the screenshot. */
export type FrameSettings = {
  type: FrameType
  finish: FrameFinish
  glare: boolean
  ratio: FrameRatio
  url: string
  shadow: FrameShadow
  background: string
}

/** Crop focus of both hero sections; index 0 is the primary section. */
export type CropFocusPair = {
  primary: CropFocus
  secondary: CropFocus
}