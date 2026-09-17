import { useCallback, useEffect, useMemo, useReducer, useRef } from "react"
import type {
  AppearanceSettings,
  CropFocus,
  FrameSettings,
  Mode,
  SectionLayout,
} from "../types"
import {
  createInitialMockupState,
  mockupReducer,
  type MockupState,
} from "../services/mockupState"
import {
  createImageObjectUrl,
  firstImageFile,
  revokeObjectUrls,
} from "../services/uploads"

/**
 * Named, referentially stable commands for every change the builder supports.
 * Passing these (instead of raw setters) keeps memoized children stable.
 */
export type MockupActions = {
  /** Replace the uploaded screenshot with the first image in `files`. */
  replaceImages: (files: FileList | File[]) => void
  removeImage: (index: number) => void
  setMode: (mode: Mode) => void
  selectSection: (index: number) => void
  resizeSection: (index: number, layout: SectionLayout) => void
  setFocus: (section: number, focus: CropFocus) => void
  updateAppearance: (patch: Partial<AppearanceSettings>) => void
  updateFrame: (patch: Partial<FrameSettings>) => void
}

/**
 * React adapter for the mockup document.
 *
 * Owns the reducer plus the one side effect that cannot live in it: the blob
 * URL lifetime of uploaded images. Components only ever see `state` and
 * `actions`, both designed to be stable across unrelated re-renders.
 */
export function useMockupState(): {
  state: MockupState
  actions: MockupActions
} {
  const [state, dispatch] = useReducer(
    mockupReducer,
    undefined,
    createInitialMockupState,
  )
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Uploaded images are owned here: release their blob URLs on unmount.
  useEffect(() => () => revokeObjectUrls(stateRef.current.images), [])

  const replaceImages = useCallback((files: FileList | File[]) => {
    const file = firstImageFile(files)
    if (!file) return
    const url = createImageObjectUrl(file)
    revokeObjectUrls(stateRef.current.images)
    dispatch({ type: "images/replace", urls: [url] })
  }, [])

  const removeImage = useCallback((index: number) => {
    revokeObjectUrls([stateRef.current.images[index] ?? ""])
    dispatch({ type: "images/remove", index })
  }, [])

  const actions = useMemo<MockupActions>(
    () => ({
      replaceImages,
      removeImage,
      setMode: (mode) => dispatch({ type: "mode/set", mode }),
      selectSection: (index) => dispatch({ type: "section/select", index }),
      resizeSection: (index, layout) =>
        dispatch({ type: "section/resize", index, layout }),
      setFocus: (section, focus) =>
        dispatch({ type: "focus/set", section, focus }),
      updateAppearance: (patch) => dispatch({ type: "appearance/update", patch }),
      updateFrame: (patch) => dispatch({ type: "frame/update", patch }),
    }),
    [replaceImages, removeImage],
  )

  return { state, actions }
}