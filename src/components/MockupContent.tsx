import { memo, useCallback } from "react"
import type { KeyboardEvent, RefObject } from "react"
import { isLightColor } from "../services/color"
import { SPLIT_MAX_WIDTH, SPLIT_MIN_WIDTH } from "../services/constants"
import { stepSplitWidth } from "../services/layout"
import type {
  CropFocus,
  CropFocusPair,
  Mode,
  SectionLayout,
} from "../types"
import { useCropDrag } from "../hooks/useCropDrag"
import { useDividerDrag } from "../hooks/useDividerDrag"
import { UploadIcon } from "./icons"

/**
 * What is shown inside the frame screen.
 *
 * Three states share one renderer: the split atlas (two photos plus a draggable
 * divider), the single hero, and the empty upload prompt. Both drag
 * interactions live here, next to the elements that own them.
 */

export type MockupContentProps = {
  mode: Mode
  images: string[]
  sections: SectionLayout[]
  activeSection: number
  focus: CropFocusPair
  sectionRadius: number
  frameBackground: string
  canvasRef: RefObject<HTMLDivElement | null>
  onSelectSection: (index: number) => void
  onResizeSection: (index: number, layout: SectionLayout) => void
  onFocusChange: (section: number, focus: CropFocus) => void
  onRequestUpload: () => void
}

export const MockupContent = memo(function MockupContent({
  mode,
  images,
  sections,
  activeSection,
  focus,
  sectionRadius,
  frameBackground,
  canvasRef,
  onSelectSection,
  onResizeSection,
  onFocusChange,
  onRequestUpload,
}: MockupContentProps) {
  const { getCropProps } = useCropDrag({ onSelectSection, onFocusChange })

  const divider = useDividerDrag({
    canvasRef,
    onResize: (width) => onResizeSection(0, { ...sections[0], width }),
  })

  const activateOnKey = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return
      event.preventDefault()
      onRequestUpload()
    },
    [onRequestUpload],
  )

  if (mode === "split") {
    const hasAnyImage = Boolean(images[0])
    const isLight = isLightColor(frameBackground)

    return (
      <div
        className={`split-atlas-content ${isLight ? "is-light-bg" : ""}`}
        style={{
          background: frameBackground,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="atlas-pages">
          {[0, 1].map((index) => {
            const section = sections[index]
            const image =
              index === 0 ? images[0] : images[1] || images[0] || undefined

            return (
              <article
                key={index}
                className={`atlas-page ${
                  activeSection === index ? "is-selected" : ""
                }`}
                style={{
                  left: `${section.x}%`,
                  top: `${section.y}%`,
                  width: `${section.width}%`,
                  height: `${section.height}%`,
                  borderRadius: `${sectionRadius}px`,
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
                onPointerDown={() => onSelectSection(index)}
              >
                {image ? (
                  <img
                    loading="lazy"
                    decoding="async"
                    src={image}
                    alt={`Uploaded website, section ${index + 1}`}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    {...getCropProps(
                      index,
                      index === 0 ? focus.primary : focus.secondary,
                    )}
                  />
                ) : !hasAnyImage ? (
                  <button
                    type="button"
                    className="empty-split-section"
                    onClick={onRequestUpload}
                    title="Click to upload an image"
                  >
                    <UploadIcon />
                    <span>Section {index + 1}</span>
                    <small
                      style={{
                        fontSize: "10px",
                        opacity: 0.7,
                      }}
                    >
                      {Math.round(section.width)}% width · Upload
                    </small>
                  </button>
                ) : null}
                <div className="red-wash" />
              </article>
            )
          })}
        </div>
        <div
          className={`atlas-divider ${divider.isDragging ? "is-active" : ""} ${
            isLight ? "is-light-bg" : ""
          }`}
          style={{ left: `${sections[0].x + sections[0].width}%` }}
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label="Split divider. Use left and right arrow keys to resize sections."
          aria-valuenow={Math.round(sections[0].width)}
          aria-valuemin={SPLIT_MIN_WIDTH}
          aria-valuemax={SPLIT_MAX_WIDTH}
          title="Drag to resize Section 1 horizontally"
          onPointerDown={divider.onPointerDown}
          onPointerMove={divider.onPointerMove}
          onPointerUp={divider.onPointerUp}
          onPointerCancel={divider.onPointerCancel}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
            event.preventDefault()
            onResizeSection(0, {
              ...sections[0],
              width: stepSplitWidth(
                sections[0].width,
                event.key === "ArrowLeft" ? -1 : 1,
              ),
            })
          }}
        >
          <span className="divider-handle">
            <b />
            <b />
            <b />
          </span>
          <em className="divider-readout">
            S1 · {Math.round(sections[0].width)}%
          </em>
        </div>
      </div>
    )
  }

  if (!images[0]) {
    return (
      <div
        className="empty-canvas-content"
        onClick={onRequestUpload}
        role="button"
        tabIndex={0}
        onKeyDown={activateOnKey}
        title="Click to upload an image"
        aria-label="Upload an image. Activate to choose a file."
      >
        <div className="empty-icon-wrap" aria-hidden="true">
          <UploadIcon />
        </div>
        <strong className="empty-title">Your image is the mockup.</strong>
        <span className="empty-subtitle">Upload one image to begin.</span>
        <span className="empty-upload-btn" aria-hidden="true">
          Upload image
        </span>
      </div>
    )
  }

  return (
    <div className="mockup-visual">
      <div className="image-panel" style={{ borderRadius: `${sectionRadius}px` }}>
        <img
          loading="lazy"
          decoding="async"
          src={images[0]}
          alt="Primary uploaded website"
          {...getCropProps(0, focus.primary)}
        />
        <div className="red-wash" />
      </div>
    </div>
  )
})