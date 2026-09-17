import { useCallback, useState } from "react"
import type { PointerEvent as ReactPointerEvent, RefObject } from "react"
import { dividerWidthAtPoint, type PointerPoint } from "../services/drag"
import { useRafThrottle } from "./useRafThrottle"

export type DividerDrag = {
  isDragging: boolean
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void
}

/**
 * Drag behaviour for the split divider.
 *
 * Pointer moves are coalesced to one layout update per frame, and the final
 * position is committed on pointer up, so a drag never stops mid-frame.
 */
export function useDividerDrag({
  canvasRef,
  onResize,
}: {
  canvasRef: RefObject<HTMLDivElement | null>
  onResize: (width: number) => void
}): DividerDrag {
  const [isDragging, setIsDragging] = useState(false)

  const move = useRafThrottle<PointerPoint>((point) => {
    const canvas = canvasRef.current
    if (!canvas) return
    onResize(dividerWidthAtPoint(point, canvas.getBoundingClientRect()))
  })

  const endDrag = useCallback(() => {
    move.flush()
    setIsDragging(false)
  }, [move])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      setIsDragging(true)
    },
    [],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      move({ clientX: event.clientX, clientY: event.clientY })
    },
    [move],
  )

  return {
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  }
}