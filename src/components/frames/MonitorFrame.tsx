import { Screen } from "./Screen"
import type { BaseFrameProps } from "./types"

export function MonitorFrame({ finish, glare, children }: BaseFrameProps) {
  return (
    <div className={`frame-shell frame-monitor finish-${finish}`}>
      <div className="monitor-display">
        <div className="monitor-top-bezel">
          <span className="monitor-camera-lens" />
          <span className="monitor-camera-led" />
        </div>
        <Screen className="monitor-screen" glare={glare}>
          {children}
        </Screen>
        <div className="monitor-chin-bar">
          <span className="monitor-brand-dot" />
        </div>
      </div>
      <div className="monitor-stand-assembly">
        <div className="monitor-neck" />
        <div className="monitor-foot" />
      </div>
    </div>
  )
}
