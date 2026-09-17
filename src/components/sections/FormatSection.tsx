import { memo } from "react"
import type { Mode } from "../../types"

export const FormatSection = memo(function FormatSection({
  mode,
  onModeChange,
}: {
  mode: Mode
  onModeChange: (mode: Mode) => void
}) {
  return (
    <section className="tool-section" aria-label="Format">
      <div className="section-head">
        <span>Format</span>
        <span>LIVE</span>
      </div>
      <div className="mode-toggle">
        <button
          type="button"
          aria-pressed={mode === "single"}
          className={mode === "single" ? "active" : ""}
          onClick={() => onModeChange("single")}
        >
          <span className="mode-icon single-icon" />
          Single hero
        </button>
        <button
          type="button"
          aria-pressed={mode === "split"}
          className={mode === "split" ? "active" : ""}
          onClick={() => onModeChange("split")}
        >
          <span className="mode-icon split-icon" />
          Split hero
        </button>
      </div>
    </section>
  )
})