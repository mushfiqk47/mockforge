import { Screen } from "./Screen"
import type { BaseFrameProps } from "./types"

export function Frameless({ sectionRadius, glare, children }: BaseFrameProps) {
  return (
    <div
      className="frame-shell frame-none"
      style={{ borderRadius: `${sectionRadius}px` }}
    >
      <Screen
        style={{ borderRadius: `${sectionRadius}px` }}
        glare={glare}
      >
        {children}
      </Screen>
    </div>
  )
}
