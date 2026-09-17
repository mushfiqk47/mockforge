import type {
  AppearanceSettings,
  CropFocus,
  CropFocusPair,
  FrameSettings,
  Mode,
  SectionLayout,
} from "../types"
import {
  DEFAULT_FOCUS,
  DEFAULT_FRAME,
  DEFAULT_CANVAS_PADDING,
  DEFAULT_SECTION_RADIUS,
  NEUTRAL_CANVAS_BACKGROUND,
} from "./constants"
import { clampFocus, createDefaultSections, resizeSections } from "./layout"

/**
 * The whole editable mockup document plus a pure reducer over it.
 *
 * Everything the builder can change lives in this one state object, which
 * keeps the update rules (clamping, split re-linking, focus bounds) in one
 * place and lets the React layer stay a thin adapter.
 */

export type MockupState = {
  mode: Mode
  /** Blob or data URLs of the uploaded screenshots. */
  images: string[]
  sections: SectionLayout[]
  activeSection: number
  focus: CropFocusPair
  appearance: AppearanceSettings
  frame: FrameSettings
}

export type MockupAction =
  | { type: "images/replace"; urls: string[] }
  | { type: "images/remove"; index: number }
  | { type: "mode/set"; mode: Mode }
  | { type: "section/select"; index: number }
  | { type: "section/resize"; index: number; layout: SectionLayout }
  | { type: "focus/set"; section: number; focus: CropFocus }
  | { type: "appearance/update"; patch: Partial<AppearanceSettings> }
  | { type: "frame/update"; patch: Partial<FrameSettings> }

export function createInitialMockupState(): MockupState {
  return {
    mode: "single",
    images: [],
    sections: createDefaultSections(),
    activeSection: 0,
    focus: {
      primary: { ...DEFAULT_FOCUS },
      secondary: { ...DEFAULT_FOCUS },
    },
    appearance: {
      canvasBackground: NEUTRAL_CANVAS_BACKGROUND,
      canvasPadding: DEFAULT_CANVAS_PADDING,
      sectionRadius: DEFAULT_SECTION_RADIUS,
      darkTheme: true,
    },
    frame: { ...DEFAULT_FRAME },
  }
}

export function mockupReducer(
  state: MockupState,
  action: MockupAction,
): MockupState {
  switch (action.type) {
    case "images/replace":
      return { ...state, images: action.urls }

    case "images/remove":
      return {
        ...state,
        images: state.images.filter((_, index) => index !== action.index),
      }

    case "mode/set":
      return state.mode === action.mode
        ? state
        : { ...state, mode: action.mode }

    case "section/select":
      return state.activeSection === action.index
        ? state
        : { ...state, activeSection: action.index }

    case "section/resize":
      return {
        ...state,
        sections: resizeSections(state.sections, action.index, action.layout),
      }

    case "focus/set": {
      const focus = clampFocus(action.focus)
      return {
        ...state,
        focus:
          action.section === 0
            ? { ...state.focus, primary: focus }
            : { ...state.focus, secondary: focus },
      }
    }

    case "appearance/update":
      return {
        ...state,
        appearance: { ...state.appearance, ...action.patch },
      }

    case "frame/update":
      return { ...state, frame: { ...state.frame, ...action.patch } }

    default:
      return state
  }
}