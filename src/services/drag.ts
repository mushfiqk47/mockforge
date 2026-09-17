import type { CropFocus } from "../types"
import { MAX_FOCUS, MIN_FOCUS, SPLIT_MAX_WIDTH, SPLIT_MIN_WIDTH } from "./constants"
import { clamp } from "./layout"

/**
 * Pointer geometry for the two drag interactions on the canvas.
 *
 * Pure and DOM-free: callers hand in a viewport point plus the measured rect of
 * the element being dragged, and get back the next editor value.
 */

export type PointerPoint = {
  clientX: number
  clientY: number
}

export type Rect = {
  left: number
  top: number
  width: number
  height: number
}

/** Width (percent) for split section 1 when the divider sits at `point`. */
export function dividerWidthAtPoint(
  point: PointerPoint,
  canvasRect: Rect,
): number {
  if (!canvasRect.width) return SPLIT_MIN_WIDTH
  const percent = ((point.clientX - canvasRect.left) / canvasRect.width) * 100
  return clamp(percent, SPLIT_MIN_WIDTH, SPLIT_MAX_WIDTH)
}

/**
 * Focus after dragging the photo by the distance between `point` and the
 * pointer-down `origin`, as a proportion of the rendered image size.
 */
export function focusAtPoint(
  point: PointerPoint,
  origin: PointerPoint,
  startFocus: CropFocus,
  imageRect: Rect,
): CropFocus {
  const shiftX = imageRect.width
    ? ((point.clientX - origin.clientX) / imageRect.width) * 100
    : 0
  const shiftY = imageRect.height
    ? ((point.clientY - origin.clientY) / imageRect.height) * 100
    : 0

  return {
    x: clamp(startFocus.x - shiftX, MIN_FOCUS, MAX_FOCUS),
    y: clamp(startFocus.y - shiftY, MIN_FOCUS, MAX_FOCUS),
  }
}