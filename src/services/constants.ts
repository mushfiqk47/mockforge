import type { CropFocus, FrameSettings } from "../types"

/**
 * Single source of truth for DOM ids, limits and defaults used by the mockup
 * builder. Every magic number that the UI clamps against lives here so the
 * controls, the drag handlers and the reducer cannot drift apart.
 */

export const MOCKUP_CANVAS_ID = "mockup-canvas"
export const IMAGE_INPUT_ID = "mockforge-upload"
export const FRAME_BACKGROUND_INPUT_ID = "mockforge-frame-bg-upload"
export const CANVAS_BACKGROUND_INPUT_ID = "mockforge-background-upload"
export const IMAGE_UPLOAD_ACCEPT = "image/*"

/** Gap between the two hero sections in split mode, in canvas percent. */
export const SPLIT_GAP = 2
export const SPLIT_MIN_WIDTH = 25
export const SPLIT_MAX_WIDTH = 88
export const SPLIT_MIN_SECONDARY_WIDTH = 10
export const SPLIT_MAX_PRIMARY_X = 63
export const SPLIT_KEYBOARD_STEP = 2

export const MIN_SECTION_SIZE = 25
export const MAX_SECTION_SIZE = 100
export const MAX_SECTION_X = 85
export const MAX_SECTION_Y = 75

export const MIN_RADIUS = 0
export const MAX_RADIUS = 48
export const RADIUS_PRESETS = [0, 8, 14, 24, 36]
export const MIN_CANVAS_PADDING = 0
export const MAX_CANVAS_PADDING = 96
export const DEFAULT_CANVAS_PADDING = 32

export const MIN_FOCUS = 0
export const MAX_FOCUS = 100

export const NEUTRAL_CANVAS_BACKGROUND = "#111111"
export const DARK_CANVAS_BACKGROUND = "#18181c"
export const LIGHT_CANVAS_BACKGROUND = "#f9fafb"

export const EXPORT_BACKGROUND = "#111111"
export const EXPORT_TARGET_WIDTH = 3840
export const EXPORT_MIN_PIXEL_RATIO = 3
export const EXPORT_MAX_PIXEL_RATIO = 4

export const DEFAULT_FOCUS: CropFocus = {
  x: 50,
  y: 50,
}
export const DEFAULT_SECTION_RADIUS = 14
export const DEFAULT_FRAME_URL = "fitness-pro.io"
export const DEFAULT_FRAME: FrameSettings = {
  type: "browser",
  finish: "dark",
  glare: true,
  ratio: "auto",
  url: DEFAULT_FRAME_URL,
  shadow: "deep",
  background: "#000000",
}