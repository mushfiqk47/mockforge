import { useCallback, useRef } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import { ControlPanel } from "./components/ControlPanel"
import { FloatingSuggestionBox } from "./components/FloatingSuggestionBox"
import { MockupCanvas } from "./components/MockupCanvas"
import { useMockupState } from "./hooks/useMockupState"
import { MOCKUP_CANVAS_ID } from "./services/constants"
import { focusMockupPreview } from "./services/mockupCanvas"

/**
 * Composition root.
 *
 * All editing state lives in `useMockupState` and every control is a section
 * component, so this file only decides what the app is made of.
 */
export default function App() {
  const { state, actions } = useMockupState()
  const imageInputRef = useRef<HTMLInputElement>(null)

  const openImagePicker = useCallback(() => imageInputRef.current?.click(), [])

  const handleSkipToPreview = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      focusMockupPreview()
    },
    [],
  )

  return (
    <main
      className={`app-shell ${state.appearance.darkTheme ? "theme-dark" : ""}`}
    >
      <a
        href={`#${MOCKUP_CANVAS_ID}`}
        className="skip-link"
        onClick={handleSkipToPreview}
      >
        Skip to preview
      </a>

      <ControlPanel
        state={state}
        actions={actions}
        imageInputRef={imageInputRef}
      />

      <section className="stage stage-ember" aria-label="Mockup preview">
        <div className="stage-frame">
          <MockupCanvas
            mode={state.mode}
            images={state.images}
            sections={state.sections}
            activeSection={state.activeSection}
            focus={state.focus}
            appearance={state.appearance}
            frame={state.frame}
            onSelectSection={actions.selectSection}
            onResizeSection={actions.resizeSection}
            onFocusChange={actions.setFocus}
            onRequestUpload={openImagePicker}
          />
          <div className="frame-corner top left" />
          <div className="frame-corner top right" />
          <div className="frame-corner bottom left" />
          <div className="frame-corner bottom right" />
        </div>
      </section>

      <FloatingSuggestionBox />
    </main>
  )
}