import type {
  FrameFinish,
  FrameRatio,
  FrameShadow,
  FrameType,
} from "../types"

/**
 * Frame metadata, kept free of JSX so the control panel only needs to map an
 * id to an icon. Labels, ordering and copy live here.
 */

export type FrameOption = { id: FrameType; label: string; desc: string }
export type FrameFinishOption = {
  id: FrameFinish
  label: string
  color: string
}
export type FrameRatioOption = { id: FrameRatio; label: string; desc: string }

export const FRAME_OPTIONS: FrameOption[] = [
  { id: "browser", label: "Browser", desc: "macOS Safari" },
  { id: "mobile", label: "Mobile", desc: "iPhone 16 Pro" },
  { id: "laptop", label: "Laptop", desc: "MacBook Pro" },
  { id: "tablet", label: "Tablet", desc: "iPad Pro" },
  { id: "monitor", label: "Monitor", desc: "Studio Display" },
  { id: "none", label: "Frameless", desc: "Edge-to-Edge" },
]

export const FINISH_OPTIONS: FrameFinishOption[] = [
  { id: "dark", label: "Dark Titanium", color: "#27272a" },
  { id: "silver", label: "Silver", color: "#d4d4d8" },
  { id: "midnight", label: "Midnight", color: "#1e293b" },
]

export const RATIO_OPTIONS: FrameRatioOption[] = [
  { id: "auto", label: "Fit", desc: "Responsive auto" },
  { id: "16-9", label: "16:9", desc: "Desktop wide" },
  { id: "9-16", label: "9:16", desc: "Tall / Height" },
  { id: "4-3", label: "4:3", desc: "Classic display" },
  { id: "1-1", label: "1:1", desc: "Social square" },
]

export const FRAME_SHADOWS: FrameShadow[] = ["deep", "soft", "glow", "none"]

export function finishLabel(finish: FrameFinish): string {
  return FINISH_OPTIONS.find((option) => option.id === finish)?.label ?? finish
}

/** Human readable ratio, e.g. "Tall / 9:16" for the tall preset. */
export function ratioLabel(ratio: FrameRatio): string {
  return ratio === "9-16" ? "Tall / 9:16" : ratio.toUpperCase()
}