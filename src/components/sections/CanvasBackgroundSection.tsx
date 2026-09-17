import { memo, useCallback, useRef } from "react"
import type { ChangeEvent } from "react"
import {
  CANVAS_BACKGROUND_INPUT_ID,
  IMAGE_UPLOAD_ACCEPT,
  NEUTRAL_CANVAS_BACKGROUND,
} from "../../services/constants"
import { backgroundPresets } from "../../services/presets"
import { isImageFile, loadBackgroundImage } from "../../services/uploads"
import type { AppearanceSettings } from "../../types"
import { BackgroundSwatches } from "../ui/BackgroundSwatches"

export const CanvasBackgroundSection = memo(function CanvasBackgroundSection({
  background,
  onAppearanceChange,
}: {
  background: string
  onAppearanceChange: (patch: Partial<AppearanceSettings>) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleBackgroundUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null
      event.target.value = ""
      if (!isImageFile(file)) return
      const value = await loadBackgroundImage(file)
      if (value) onAppearanceChange({ canvasBackground: value })
    },
    [onAppearanceChange],
  )

  return (
    <section
      className="tool-section background-picker"
      aria-label="Canvas background"
    >
      <div className="section-head">
        <span>Canvas background</span>
        <span>LIVE</span>
      </div>
      <div className="background-controls">
        <label className="color-control">
          <span>Custom color</span>
          <input
            type="color"
            value={
              background.startsWith("#") ? background : NEUTRAL_CANVAS_BACKGROUND
            }
            onChange={(event) =>
              onAppearanceChange({ canvasBackground: event.target.value })
            }
          />
        </label>
        <BackgroundSwatches
          presets={backgroundPresets}
          selected={background}
          onSelect={(value) =>
            onAppearanceChange({ canvasBackground: value })
          }
          groupLabel="Canvas background presets"
          itemLabelPrefix="Canvas background"
        />
        <button
          type="button"
          className="background-upload"
          onClick={() => inputRef.current?.click()}
        >
          Upload background
        </button>
        <label className="sr-only" htmlFor={CANVAS_BACKGROUND_INPUT_ID}>
          Upload a custom canvas background image
        </label>
        <input
          ref={inputRef}
          id={CANVAS_BACKGROUND_INPUT_ID}
          type="file"
          accept={IMAGE_UPLOAD_ACCEPT}
          className="sr-only"
          onChange={handleBackgroundUpload}
        />
      </div>
    </section>
  )
})