import { Screen } from "./Screen"
import type { BaseFrameProps } from "./types"

function MobileStatusBar() {
  return (
    <div className="mobile-status-bar" aria-hidden="true">
      <span className="status-time">9:41</span>
      <div className="status-icons">
        <svg className="status-signal" viewBox="0 0 16 12" fill="currentColor">
          <rect x="1" y="8" width="2" height="4" rx="0.5" />
          <rect x="5" y="6" width="2" height="6" rx="0.5" />
          <rect x="9" y="3.5" width="2" height="8.5" rx="0.5" />
          <rect x="13" y="1" width="2" height="11" rx="0.5" />
        </svg>
        <svg className="status-wifi" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4.5 7.8a4.9 4.9 0 0 1 7 0 .8.8 0 1 0 1.1-1.1 6.5 6.5 0 0 0-9.2 0 .8.8 0 1 0 1.1 1.1zm-3-3a9.1 9.1 0 0 1 13 0 .8.8 0 0 0 1.1-1.1 10.7 10.7 0 0 0-15.2 0 .8.8 0 0 0 1.1 1.1z" />
        </svg>
        <div className="status-battery">
          <div className="battery-level" />
        </div>
      </div>
    </div>
  )
}

export function MobileFrame({ finish, glare, children }: BaseFrameProps) {
  return (
    <div className={`frame-shell frame-mobile finish-${finish}`}>
      <div className="mobile-button-action" />
      <div className="mobile-button-vol-up" />
      <div className="mobile-button-vol-down" />
      <div className="mobile-button-power" />
      <div className="mobile-chassis-bezel">
        <MobileStatusBar />
        <div className="mobile-dynamic-island">
          <span className="island-camera" />
          <span className="island-sensor" />
        </div>
        <Screen className="mobile-screen" glare={glare}>
          {children}
        </Screen>
        <div className="mobile-home-indicator-bar">
          <span className="home-bar" />
        </div>
      </div>
    </div>
  )
}
