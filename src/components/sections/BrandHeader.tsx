import { memo } from "react"
import type { AppearanceSettings } from "../../types"
import { BrandLogo, SunMoonIcon, XBrandIcon } from "../icons"

export const BrandHeader = memo(function BrandHeader({
  darkTheme,
  onAppearanceChange,
}: {
  darkTheme: boolean
  onAppearanceChange: (patch: Partial<AppearanceSettings>) => void
}) {
  return (
    <header className="brand-header">
      <div className="brand-identity">
        <BrandLogo />
        <h1 className="brand-name">MockForge</h1>
      </div>
      <div className="brand-header-actions">
        <a
          href="https://x.com/mushfiqk47"
          target="_blank"
          rel="noopener noreferrer"
          className="theme-icon-button brand-x-btn"
          title="Follow @mushfiqk47 on X"
          aria-label="Follow @mushfiqk47 on X"
        >
          <XBrandIcon className="theme-toggle-icon" />
        </a>
        <button
          type="button"
          className="theme-icon-button"
          onClick={() => onAppearanceChange({ darkTheme: !darkTheme })}
          aria-label={darkTheme ? "Switch to light theme" : "Switch to dark theme"}
          title={darkTheme ? "Switch to light theme" : "Switch to dark theme"}
        >
          <SunMoonIcon className="theme-toggle-icon" />
        </button>
      </div>
    </header>
  )
})