import { Screen } from "./Screen"
import type { BaseFrameProps } from "./types"

export function LaptopFrame({ finish, glare, children }: BaseFrameProps) {
  return (
    <div className={`frame-shell frame-laptop finish-${finish}`}>
      <div className="laptop-lid">
        <div className="laptop-top-bezel">
          <div className="laptop-camera-notch">
            <span className="laptop-camera-lens" />
          </div>
        </div>
        <Screen className="laptop-screen" glare={glare}>
          {children}
        </Screen>
      </div>
      <div className="laptop-base-deck">
        <div className="laptop-notch-indent" />
      </div>
    </div>
  )
}
