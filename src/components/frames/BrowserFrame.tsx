import { LockIcon } from "../icons"
import { Screen } from "./Screen"
import type { BaseFrameProps } from "./types"

function BrowserNavIcons() {
  return (
    <div className="browser-nav-group" aria-hidden="true">
      <span className="browser-nav-btn">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 3.5L5.5 8L10 12.5" />
        </svg>
      </span>
      <span className="browser-nav-btn nav-btn-disabled">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3.5L10.5 8L6 12.5" />
        </svg>
      </span>
      <span className="browser-nav-btn reload-btn">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13.2 7.8A5.2 5.2 0 1 1 11.6 4.1" />
          <polyline points="13.5 2.5 13.5 5.5 10.5 5.5" />
        </svg>
      </span>
    </div>
  )
}

export function BrowserFrame({
  finish,
  glare,
  url,
  sectionRadius,
  children,
}: BaseFrameProps) {
  return (
    <div
      className={`frame-shell frame-browser finish-${finish}`}
      style={{ borderRadius: `${sectionRadius}px` }}
    >
      <div className="browser-titlebar">
        <div className="browser-titlebar-left">
          <div className="browser-dots" aria-hidden="true">
            <span className="dot dot-red">
              <i>×</i>
            </span>
            <span className="dot dot-yellow">
              <i>−</i>
            </span>
            <span className="dot dot-green">
              <i>+</i>
            </span>
          </div>
          <BrowserNavIcons />
        </div>

        <div className="browser-address-pill">
          <LockIcon className="browser-lock-icon" />
          <span className="browser-url-text">
            {url || "fitness-studio.io"}
          </span>
          <span className="browser-pill-badge">PRO</span>
        </div>

        <div className="browser-titlebar-right">
          <div className="browser-actions">
            <span className="browser-action-btn" aria-hidden="true">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M8 2.5v7M5.5 5L8 2.5 10.5 5M3.5 9.5v3a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="browser-action-btn" aria-hidden="true">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M8 3.5v9M3.5 8h9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <Screen glare={glare}>{children}</Screen>
    </div>
  )
}
