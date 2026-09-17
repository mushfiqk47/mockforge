import { memo } from "react"
import type { CSSProperties, ReactNode } from "react"
import type { FrameFinish, FrameType } from "../types"
import { LockIcon } from "./icons"

/**
 * Device chrome around the mockup content.
 *
 * The caller only supplies the frame settings and the content to display; how
 * each device renders its bezel, camera, status bar and glass glare stays
 * private to this module.
 */

function Screen({
  className,
  style,
  glare,
  children,
}: {
  className?: string
  style?: CSSProperties
  glare: boolean
  children: ReactNode
}) {
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

export type FrameShellProps = {
  type: FrameType
  finish: FrameFinish
  glare: boolean
  url: string
  sectionRadius: number
  children: ReactNode
}

export const FrameShell = memo(function FrameShell({
  type,
  finish,
  glare,
  url,
  sectionRadius,
  children,
}: FrameShellProps) {
  switch (type) {
    case "browser":
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

    case "mobile":
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

    case "laptop":
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

    case "tablet":
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

    case "monitor":
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

    case "none":
    default:
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
})