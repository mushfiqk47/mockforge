import { useCallback, useRef } from "react"
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react"
import type { CropFocus } from "../types"
import { focusAtPoint, type PointerPoint } from "../services/drag"
import { useRafThrottle } from "./useRafThrottle"

type ActiveCropDrag = {
  section: number
  image: HTMLImageElement
  origin: PointerPoint
  startFocus: CropFocus
}

type CropImageProps = {
  className: string
  draggable: false
  style: CSSProperties
  onPointerDown: (event: ReactPointerEvent<HTMLImageElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLImageElement>) => void
  onPointerUp: () => void
  onPointerCancel: () => void
}

/**
 * Drag-to-pan behaviour for a photo inside its frame.
 *
 * `getCropProps` is produced once and can be spread onto any photo; the drag
 * itself is coalesced to one focus update per animation frame.
 */
export function useCropDrag({
  onSelectSection,
  onFocusChange,
}: {
  onSelectSection: (section: number) => void
  onFocusChange: (section: number, focus: CropFocus) => void
}): { getCropProps: (section: number, focus: CropFocus) => CropImageProps } {
  const activeDrag = useRef<ActiveCropDrag | null>(null)

  const move = useRafThrottle<PointerPoint>((point) => {
    const drag = activeDrag.current
    if (!drag) return
    onFocusChange(
      drag.section,
      focusAtPoint(
        point,
        drag.origin,
        drag.startFocus,
        drag.image.getBoundingClientRect(),
      ),
    )
  })

  const endDrag = useCallback(() => {
    move.flush()
    activeDrag.current = null
  }, [move])

  const getCropProps = useCallback(
    (section: number, focus: CropFocus): CropImageProps => ({
      className: "crop-photo",
      draggable: false,
      style: { objectPosition: `${focus.x}% ${focus.y}%` },
      onPointerDown: (event) => {
        event.stopPropagation()
        onSelectSection(section)
        event.currentTarget.setPointerCapture(event.pointerId)
        activeDrag.current = {
          section,
          image: event.currentTarget,
          origin: {
            clientX: event.clientX,
            clientY: event.clientY,
          },
          startFocus: focus,
        }
      },
      onPointerMove: (event) =>
        move({ clientX: event.clientX, clientY: event.clientY }),
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    }),
    [endDrag, move, onSelectSection],
  )

  return { getCropProps }
}