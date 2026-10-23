import type { ScreenProps } from "./types"

export function Screen({ className, style, glare, children }: ScreenProps) {
  return (
    <div
      className={className ? `frame-viewport-screen ${className}` : "frame-viewport-screen"}
      style={style}
    >
      {children}
      {glare && <div className="frame-glare-overlay" aria-hidden="true" />}
    </div>
  )
}
