import { memo, useCallback, useState } from "react"
import { exportMockupPng } from "../../services/mockupCanvas"
import type { FrameType } from "../../types"
import { ArrowUpRight } from "../icons"

/**
 * Docked export action. The export progress is local state: nothing outside
 * this footer needs to know that a render is in flight.
 */
export const ExportFooter = memo(function ExportFooter({
  canExport,
  frameType,
}: {
  canExport: boolean
  frameType: FrameType
}) {
  const [isExporting, setIsExporting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleExport = useCallback(async () => {
    if (!canExport || isExporting) return
    setIsExporting(true)
    setErrorMessage(null)
    try {
      const result = await exportMockupPng(frameType)
      if (!result.ok) {
        setErrorMessage("Export failed. Please verify the preview and try again.")
      }
    } catch {
      setErrorMessage("Export encountered an unexpected error.")
    } finally {
      setIsExporting(false)
    }
  }, [canExport, isExporting, frameType])

  const isDisabled = isExporting || !canExport

  return (
    <footer className="control-panel-footer">
      {errorMessage && (
        <p className="export-error-note" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="button"
        className="export-button"
        onClick={handleExport}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        title={
          canExport
            ? "Export the preview as PNG"
            : "Upload an image or switch to split mode to enable export"
        }
      >
        {isExporting ? "Rendering..." : "Export PNG"} <ArrowUpRight />
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {isExporting
          ? "Rendering PNG export."
          : errorMessage
            ? errorMessage
            : canExport
              ? "Preview ready. Export is available."
              : "Upload one image to begin. Export is disabled."}
      </p>
    </footer>
  )
})
