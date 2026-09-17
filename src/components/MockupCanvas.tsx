import { memo, useMemo, useRef } from "react"
import type { CSSProperties } from "react"
import {
  DARK_CANVAS_BACKGROUND,
  LIGHT_CANVAS_BACKGROUND,
  MOCKUP_CANVAS_ID,
  NEUTRAL_CANVAS_BACKGROUND,
} from "../services/constants"
import type {
  AppearanceSettings,
  CropFocus,
  CropFocusPair,
  FrameSettings,
  Mode,
  SectionLayout,
} from "../types"
import { FrameShell } from "./FrameShell"
import { MockupContent } from "./MockupContent"

/**
 * The exported artefact: canvas surface, device chrome and hero content.
 *
 * Receives state slices rather than individual fields so that unrelated panel
 * changes leave every prop identity untouched and the memo below holds.
 */
export type MockupCanvasProps = {
  mode: Mode
  images: string[]
  sections: SectionLayout[]
  activeSection: number
  focus: CropFocusPair
  appearance: AppearanceSettings
  frame: FrameSettings
  onSelectSection: (index: number) => void
  onResizeSection: (index: number, layout: SectionLayout) => void
  onFocusChange: (section: number, focus: CropFocus) => void
  onRequestUpload: () => void
}

export const MockupCanvas = memo(function MockupCanvas({
  mode,
  images,
  sections,
  activeSection,
  focus,
  appearance,
  frame,
  onSelectSection,
  onResizeSection,
  onFocusChange,
  onRequestUpload,
}: MockupCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const primaryImage = images[0]

  // Keep the neutral preset when there is something to show, but fall back to
  // the theme-aware surface while the canvas is still empty.
  const effectiveBackground = useMemo(() => {
    if (appearance.canvasBackground !== NEUTRAL_CANVAS_BACKGROUND)
      return appearance.canvasBackground
    if (primaryImage || mode === "split") return NEUTRAL_CANVAS_BACKGROUND
    return appearance.darkTheme
      ? DARK_CANVAS_BACKGROUND
      : LIGHT_CANVAS_BACKGROUND
  }, [appearance.canvasBackground, appearance.darkTheme, mode, primaryImage])

  const canvasStyle = useMemo(
    () =>
      ({
        background: effectiveBackground,
        padding: `${appearance.canvasPadding}px`,
        "--frame-bg": frame.background,
      }) as CSSProperties,
    [appearance.canvasPadding, effectiveBackground, frame.background],
  )

  const isEmpty = !primaryImage && mode !== "split"

  return (
    <div
      id={MOCKUP_CANVAS_ID}
      ref={canvasRef}
      tabIndex={-1}
      className={`mockup-canvas frame-mode-${frame.type} finish-${frame.finish} ratio-${frame.ratio} shadow-${frame.shadow} ${
        isEmpty ? "is-empty" : ""
      }`}
      style={canvasStyle}
    >
      <div className="mockup-frame-container">
        <FrameShell
          type={frame.type}
          finish={frame.finish}
          glare={frame.glare}
          url={frame.url}
          sectionRadius={appearance.sectionRadius}
        >
          <MockupContent
            mode={mode}
            images={images}
            sections={sections}
            activeSection={activeSection}
            focus={focus}
            sectionRadius={appearance.sectionRadius}
            frameBackground={frame.background}
            canvasRef={canvasRef}
            onSelectSection={onSelectSection}
            onResizeSection={onResizeSection}
            onFocusChange={onFocusChange}
            onRequestUpload={onRequestUpload}
          />
        </FrameShell>
      </div>
    </div>
  )
})