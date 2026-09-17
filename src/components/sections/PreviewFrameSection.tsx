import { memo, useCallback, useRef } from "react"
import type { ChangeEvent, ReactElement } from "react"
import { isLightColor } from "../../services/color"
import {
  FRAME_BACKGROUND_INPUT_ID,
  IMAGE_UPLOAD_ACCEPT,
  MAX_RADIUS,
  MIN_RADIUS,
  RADIUS_PRESETS,
} from "../../services/constants"
import {
  FINISH_OPTIONS,
  finishLabel,
  FRAME_OPTIONS,
  FRAME_SHADOWS,
  RATIO_OPTIONS,
  ratioLabel,
} from "../../services/frames"
import { frameBgPresets } from "../../services/presets"
import { isImageFile, loadBackgroundImage } from "../../services/uploads"
import type {
  AppearanceSettings,
  FrameSettings,
  FrameType,
} from "../../types"
import { BackgroundSwatches } from "../ui/BackgroundSwatches"
import { RangeInput } from "../ui/RangeInput"
import {
  BrowserFrameIcon,
  LaptopFrameIcon,
  MobileFrameIcon,
  MonitorFrameIcon,
  NoneFrameIcon,
  TabletFrameIcon,
} from "../icons"

const FRAME_ICONS: Record<FrameType, () => ReactElement> = {
  browser: BrowserFrameIcon,
  mobile: MobileFrameIcon,
  laptop: LaptopFrameIcon,
  tablet: TabletFrameIcon,
  monitor: MonitorFrameIcon,
  none: NoneFrameIcon,
}

/**
 * Every control that shapes the device frame: model, finish, glass glare,
 * ratio, address bar, corner radius, elevation and interior background.
 */
export const PreviewFrameSection = memo(function PreviewFrameSection({
  frame,
  canvasBackground,
  sectionRadius,
  onFrameChange,
  onAppearanceChange,
}: {
  frame: FrameSettings
  canvasBackground: string
  sectionRadius: number
  onFrameChange: (patch: Partial<FrameSettings>) => void
  onAppearanceChange: (patch: Partial<AppearanceSettings>) => void
}) {
  const frameBgInputRef = useRef<HTMLInputElement>(null)

  const handleFrameBackgroundUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null
      event.target.value = ""
      if (!isImageFile(file)) return
      const value = await loadBackgroundImage(file)
      if (value) onFrameChange({ background: value })
    },
    [onFrameChange],
  )

  return (
    <section
      className="tool-section preview-frame-section"
      aria-label="Preview frame"
    >
      <div className="section-head">
        <span>Preview frame</span>
        <span>{frame.type.toUpperCase()}</span>
      </div>

      {/* Frame Model Grid */}
      <div className="frame-type-grid">
        {FRAME_OPTIONS.map(({ id, label, desc }) => {
          const Icon = FRAME_ICONS[id]
          return (
            <button
              key={id}
              type="button"
              className={`frame-option-card ${
                frame.type === id ? "is-active" : ""
              }`}
              onClick={() => onFrameChange({ type: id })}
              aria-pressed={frame.type === id}
              title={desc}
            >
              <div className="frame-card-icon">
                <Icon />
              </div>
              <span className="frame-card-label">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Finish & Glare Row */}
      <div className="frame-subcontrol">
        <div className="subcontrol-head">
          <span>Finish & sheen</span>
          <b>{finishLabel(frame.finish)}</b>
        </div>
        <div className="finish-chips">
          {FINISH_OPTIONS.map(({ id, label, color }) => (
            <button
              key={id}
              type="button"
              className={`finish-chip ${frame.finish === id ? "is-active" : ""}`}
              onClick={() => onFrameChange({ finish: id })}
              aria-pressed={frame.finish === id}
              title={label}
            >
              <span className="finish-color-dot" style={{ background: color }} />
              {label.split(" ")[0]}
            </button>
          ))}
          <button
            type="button"
            className={`glare-toggle-chip ${frame.glare ? "is-active" : ""}`}
            onClick={() => onFrameChange({ glare: !frame.glare })}
            aria-pressed={frame.glare}
            title="Toggle 3D Screen Glass Sheen Reflection"
          >
            <span className="glare-star">✦</span>
            {frame.glare ? "Glare on" : "No glare"}
          </button>
        </div>
      </div>

      {/* Frame Height & Ratio */}
      <div className="frame-subcontrol">
        <div className="subcontrol-head">
          <span>Frame height & ratio</span>
          <b>{ratioLabel(frame.ratio)}</b>
        </div>
        <div className="ratio-chips">
          {RATIO_OPTIONS.map(({ id, label, desc }) => (
            <button
              key={id}
              type="button"
              className={`ratio-chip ${frame.ratio === id ? "is-active" : ""}`}
              onClick={() => onFrameChange({ ratio: id })}
              aria-pressed={frame.ratio === id}
              title={`${label} · ${desc}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {frame.type === "browser" && (
        <div className="frame-url-control">
          <label>
            <span>Header URL</span>
            <input
              type="text"
              value={frame.url}
              placeholder="e.g. fitness-pro.io"
              onChange={(event) => onFrameChange({ url: event.target.value })}
            />
          </label>
        </div>
      )}

      {/* Corner Radius Control */}
      <div className="frame-subcontrol">
        <div className="subcontrol-head">
          <span>Corner radius</span>
          <b>{sectionRadius}px</b>
        </div>
        <div className="radius-control-slider">
          <RangeInput
            min={MIN_RADIUS}
            max={MAX_RADIUS}
            value={sectionRadius}
            onChange={(radius) =>
              onAppearanceChange({ sectionRadius: radius })
            }
            valueText={`${sectionRadius} pixels`}
            ariaLabel="Corner radius"
          />
          <div className="radius-quick-presets">
            {RADIUS_PRESETS.map((radius) => (
              <button
                key={radius}
                type="button"
                className={`radius-preset-chip ${
                  sectionRadius === radius ? "is-active" : ""
                }`}
                onClick={() => onAppearanceChange({ sectionRadius: radius })}
                aria-pressed={sectionRadius === radius}
              >
                {radius === 0 ? "Square" : `${radius}px`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="frame-subcontrol">
        <div className="subcontrol-head">
          <span>Frame elevation</span>
          <b>{frame.shadow}</b>
        </div>
        <div className="shadow-chips">
          {FRAME_SHADOWS.map((shadow) => (
            <button
              key={shadow}
              type="button"
              className={`ratio-chip ${
                frame.shadow === shadow ? "is-active" : ""
              }`}
              onClick={() => onFrameChange({ shadow })}
              aria-pressed={frame.shadow === shadow}
            >
              {shadow.charAt(0).toUpperCase() + shadow.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Background Control */}
      <div className="frame-subcontrol">
        <div className="subcontrol-head">
          <span>Frame background</span>
          <b>{isLightColor(frame.background) ? "Light" : "Dark"}</b>
        </div>
        <div className="background-controls">
          <label className="color-control">
            <span>Frame custom color</span>
            <input
              type="color"
              value={frame.background.startsWith("#") ? frame.background : "#000000"}
              onChange={(event) =>
                onFrameChange({ background: event.target.value })
              }
            />
          </label>
          <BackgroundSwatches
            presets={frameBgPresets}
            selected={frame.background}
            onSelect={(value) => onFrameChange({ background: value })}
            groupLabel="Frame background presets"
            itemLabelPrefix="Frame background"
          />
          <div className="split-bg-actions-row">
            <button
              type="button"
              className="background-upload split-upload-btn"
              onClick={() => frameBgInputRef.current?.click()}
            >
              Upload frame BG
            </button>
            <button
              type="button"
              className="split-match-btn"
              onClick={() => onFrameChange({ background: canvasBackground })}
              title="Match frame background to canvas background"
            >
              Match canvas
            </button>
          </div>
          <label className="sr-only" htmlFor={FRAME_BACKGROUND_INPUT_ID}>
            Upload a custom frame background image
          </label>
          <input
            ref={frameBgInputRef}
            id={FRAME_BACKGROUND_INPUT_ID}
            type="file"
            accept={IMAGE_UPLOAD_ACCEPT}
            className="sr-only"
            onChange={handleFrameBackgroundUpload}
          />
        </div>
      </div>
    </section>
  )
})