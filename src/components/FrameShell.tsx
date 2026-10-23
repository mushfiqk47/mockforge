import { memo } from "react"
import type { ComponentType, ReactNode } from "react"
import type { FrameFinish, FrameType } from "../types"
import { BrowserFrame } from "./frames/BrowserFrame"
import { Frameless } from "./frames/Frameless"
import { LaptopFrame } from "./frames/LaptopFrame"
import { MobileFrame } from "./frames/MobileFrame"
import { MonitorFrame } from "./frames/MonitorFrame"
import { TabletFrame } from "./frames/TabletFrame"
import type { BaseFrameProps } from "./frames/types"

export type FrameShellProps = {
  type: FrameType
  finish: FrameFinish
  glare: boolean
  url: string
  sectionRadius: number
  children: ReactNode
}

const FRAME_MAP: Record<FrameType, ComponentType<BaseFrameProps>> = {
  browser: BrowserFrame,
  mobile: MobileFrame,
  laptop: LaptopFrame,
  tablet: TabletFrame,
  monitor: MonitorFrame,
  none: Frameless,
}

/**
 * Device chrome around the mockup content.
 *
 * Dispatches to pluggable device hardware frame modules while preserving
 * a single unified contract for callers.
 */
export const FrameShell = memo(function FrameShell({
  type,
  finish,
  glare,
  url,
  sectionRadius,
  children,
}: FrameShellProps) {
  const Component = FRAME_MAP[type] ?? Frameless
  return (
    <Component
      finish={finish}
      glare={glare}
      url={url}
      sectionRadius={sectionRadius}
    >
      {children}
    </Component>
  )
})
