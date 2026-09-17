import type { CropFocus, SectionLayout } from "../types"
import {
  MAX_FOCUS,
  MAX_SECTION_SIZE,
  MAX_SECTION_X,
  MAX_SECTION_Y,
  MIN_FOCUS,
  MIN_SECTION_SIZE,
  SPLIT_GAP,
  SPLIT_KEYBOARD_STEP,
  SPLIT_MAX_PRIMARY_X,
  SPLIT_MAX_WIDTH,
  SPLIT_MIN_SECONDARY_WIDTH,
  SPLIT_MIN_WIDTH,
} from "./constants"

/**
 * Pure section-layout math for split mode.
 *
 * Invariants kept here (not in components):
 * - Section 1 (index 0) is the source of truth for the split; the divider
 *   position, section 2's `x` and its width are derived from it.
 * - Section 2 can never overlap section 1 or fall off the canvas.
 * - Every layout value stays inside the range the controls advertise.
 */

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** The four sliders of the split inspector, in display order. */
export const SPLIT_SECTION_CONTROLS = [
  {
    property: "width",
    label: "Horizontal size",
    min: MIN_SECTION_SIZE,
    max: MAX_SECTION_SIZE,
  },
  {
    property: "height",
    label: "Vertical size",
    min: MIN_SECTION_SIZE,
    max: MAX_SECTION_SIZE,
  },
  {
    property: "x",
    label: "Horizontal position",
    min: 0,
    max: MAX_SECTION_X,
  },
  { property: "y", label: "Vertical position", min: 0, max: MAX_SECTION_Y },
] as const satisfies readonly {
  property: keyof SectionLayout
  label: string
  min: number
  max: number
}[]

export type SectionControl = (typeof SPLIT_SECTION_CONTROLS)[number]

export function createDefaultSections(): SectionLayout[] {
  return [
    { x: 0, y: 0, width: 62, height: 100 },
    { x: 64, y: 0, width: 36, height: 100 },
  ]
}

/**
 * Section 2's horizontal size and position are always derived from section 1,
 * so the inspector disables those sliders instead of fighting the layout.
 */
export function isDerivedSectionProperty(
  section: number,
  property: keyof SectionLayout,
): boolean {
  return section === 1 && (property === "width" || property === "x")
}

/**
 * Apply a layout change, re-linking the split when section 1 moves or resizes.
 * Returns a new array with untouched sections left referentially stable.
 */
export function resizeSections(
  current: SectionLayout[],
  index: number,
  layout: SectionLayout,
): SectionLayout[] {
  const next = current.map((section, position) =>
    position === index ? layout : section,
  )

  if (index !== 0) return next

  const width = clamp(layout.width, SPLIT_MIN_WIDTH, SPLIT_MAX_WIDTH)
  const x = clamp(layout.x, 0, SPLIT_MAX_PRIMARY_X)

  return [
    { ...layout, x, width },
    {
      ...current[1],
      x: x + width + SPLIT_GAP,
      width: Math.max(SPLIT_MIN_SECONDARY_WIDTH, 100 - x - width - SPLIT_GAP),
    },
  ]
}

/** Apply a single layout field, keeping the rest of the section untouched. */
export function withLayoutProperty(
  layout: SectionLayout,
  property: keyof SectionLayout,
  value: number,
): SectionLayout {
  const next: SectionLayout = { ...layout }
  next[property] = value
  return next
}

/** Keyboard nudge for the split divider (arrow keys). */
export function stepSplitWidth(width: number, direction: -1 | 1): number {
  return clamp(
    width + direction * SPLIT_KEYBOARD_STEP,
    SPLIT_MIN_WIDTH,
    SPLIT_MAX_WIDTH,
  )
}

export function clampFocus(focus: CropFocus): CropFocus {
  return {
    x: clamp(focus.x, MIN_FOCUS, MAX_FOCUS),
    y: clamp(focus.y, MIN_FOCUS, MAX_FOCUS),
  }
}

/** Percent progress of a value inside its slider range. */
export function sliderProgress(value: number, min: number, max: number): number {
  if (max <= min) return 0
  return ((value - min) / (max - min)) * 100
}