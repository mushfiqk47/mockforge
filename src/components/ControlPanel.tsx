import { memo } from "react"
import type { RefObject } from "react"
import type { MockupActions } from "../hooks/useMockupState"
import type { MockupState } from "../services/mockupState"
import { BrandHeader } from "./sections/BrandHeader"
import { CanvasBackgroundSection } from "./sections/CanvasBackgroundSection"
import { ExportFooter } from "./sections/ExportFooter"
import { FormatSection } from "./sections/FormatSection"
import { ImagerySection } from "./sections/ImagerySection"
import { PreviewFrameSection } from "./sections/PreviewFrameSection"
import { SplitInspectorSection } from "./sections/SplitInspectorSection"

/**
 * The whole left-hand control panel.
 *
 * Takes the document and the command set, then hands each section exactly the
 * slice it needs so sections can stay memoized and independently understandable.
 */
export const ControlPanel = memo(function ControlPanel({
  state,
  actions,
  imageInputRef,
}: {
  state: MockupState
  actions: MockupActions
  imageInputRef: RefObject<HTMLInputElement | null>
}) {
  const { mode, images, sections, activeSection, appearance, frame } = state
  const canExport = Boolean(images[0]) || mode === "split"

  return (
    <aside className="control-panel" aria-label="Mockup controls">
      <div className="control-panel-scroll">
        <BrandHeader
          darkTheme={appearance.darkTheme}
          onAppearanceChange={actions.updateAppearance}
        />

        <ImagerySection
          images={images}
          fileInputRef={imageInputRef}
          onImagesSelected={actions.replaceImages}
          onRemoveImage={actions.removeImage}
        />

        <FormatSection mode={mode} onModeChange={actions.setMode} />

        <PreviewFrameSection
          frame={frame}
          canvasBackground={appearance.canvasBackground}
          sectionRadius={appearance.sectionRadius}
          onFrameChange={actions.updateFrame}
          onAppearanceChange={actions.updateAppearance}
        />

        <CanvasBackgroundSection
          background={appearance.canvasBackground}
          onAppearanceChange={actions.updateAppearance}
        />

        {mode === "split" && (
          <SplitInspectorSection
            sections={sections}
            activeSection={activeSection}
            sectionRadius={appearance.sectionRadius}
            onSelectSection={actions.selectSection}
            onResizeSection={actions.resizeSection}
            onAppearanceChange={actions.updateAppearance}
          />
        )}
      </div>

      <ExportFooter canExport={canExport} frameType={frame.type} />
    </aside>
  )
})