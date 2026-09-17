import type { FrameType } from "../types"
import {
  EXPORT_BACKGROUND,
  EXPORT_MAX_PIXEL_RATIO,
  EXPORT_MIN_PIXEL_RATIO,
  EXPORT_TARGET_WIDTH,
  MOCKUP_CANVAS_ID,
} from "./constants"

/**
 * Everything that touches the rendered canvas node: scrolling to it, the
 * "skip to preview" focus target, and the PNG export pipeline.
 *
 * The export is one call from the caller's point of view; behind it the module
 * inlines every photo, captures the DOM, downloads the file and always
 * restores the page to its original state.
 */

export function getMockupCanvasElement(): HTMLElement | null {
  return document.getElementById(MOCKUP_CANVAS_ID)
}

/** Move focus and scroll position to the preview (skip-link target). */
export function focusMockupPreview(): void {
  const node = getMockupCanvasElement()
  if (!node) return
  node.scrollIntoView({ behavior: "smooth", block: "center" })
  node.focus()
}

let htmlToImageModule: Promise<typeof import("html-to-image")> | null = null

/** Load (and cache) the export library only when an export is requested. */
function loadHtmlToImage(): Promise<typeof import("html-to-image")> {
  htmlToImageModule ??= import("html-to-image")
  return htmlToImageModule
}

/**
 * Repaint every <img> from a same-origin canvas so the capture cannot be
 * tainted by cross-origin pixels. Returns a function that restores the
 * original sources.
 */
async function inlineCanvasImages(node: HTMLElement): Promise<() => void> {
  const images = Array.from(node.querySelectorAll("img"))
  const originalSources = images.map((image) => image.src)

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete || !image.naturalWidth || !image.naturalHeight) return
      const snapshot = document.createElement("canvas")
      snapshot.width = image.naturalWidth
      snapshot.height = image.naturalHeight
      const context = snapshot.getContext("2d")
      if (!context) return
      context.drawImage(image, 0, 0)
      image.src = snapshot.toDataURL("image/png")
      try {
        await image.decode()
      } catch {
        // Keep the inlined source even if decode reporting is unsupported.
      }
    }),
  )

  return () => {
    images.forEach((image, index) => {
      image.src = originalSources[index]
    })
  }
}

function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataUrl
  link.click()
}

export type ExportResult = {
  ok: boolean
  error?: unknown
}

export async function exportMockupPng(frameType: FrameType): Promise<ExportResult> {
  const node = getMockupCanvasElement()
  if (!node) return { ok: false }

  const { toPng } = await loadHtmlToImage()
  let restoreImages: (() => void) | null = null
  node.classList.add("is-exporting")

  try {
    restoreImages = await inlineCanvasImages(node)
    // Measure after the export-only styles are applied, so the capture matches
    // the node exactly as it will be rendered.
    const rect = node.getBoundingClientRect()
    if (!rect.width || !rect.height) return { ok: false }

    const dataUrl = await toPng(node, {
      pixelRatio: Math.max(
        EXPORT_MIN_PIXEL_RATIO,
        Math.min(EXPORT_MAX_PIXEL_RATIO, EXPORT_TARGET_WIDTH / rect.width),
      ),
      cacheBust: false,
      skipFonts: true,
      backgroundColor: EXPORT_BACKGROUND,
      width: rect.width,
      height: rect.height,
      filter: (element) => !element.classList?.contains("atlas-divider"),
    })
    downloadDataUrl(dataUrl, `mockup-forge-${frameType}.png`)
    return { ok: true }
  } catch (error) {
    console.error("Export failed", error)
    return { ok: false, error }
  } finally {
    restoreImages?.()
    node.classList.remove("is-exporting")
  }
}