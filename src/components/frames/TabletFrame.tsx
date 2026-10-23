import { Screen } from "./Screen"
import type { BaseFrameProps } from "./types"

export function TabletFrame({ finish, glare, children }: BaseFrameProps) {
  return (
    <div className={`frame-shell frame-tablet finish-${finish}`}>
      <div className="tablet-button-power" />
      <div className="tablet-button-volume" />
      <div className="tablet-chassis-bezel">
        <div className="tablet-camera-dot">
          <span className="camera-glint" />
        </div>
        <Screen className="tablet-screen" glare={glare}>
          {children}
        </Screen>
        <div className="tablet-home-indicator-bar">
          <span className="home-bar" />
        </div>
      </div>
    </div>
  )
}
