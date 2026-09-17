import { useCallback, useEffect, useMemo, useRef } from "react"

export type RafThrottled<Value> = ((value: Value) => void) & {
  /** Apply the last pending value immediately. */
  flush: () => void
  /** Drop the last pending value. */
  cancel: () => void
}

/**
 * Coalesce high-frequency calls (pointermove) down to one call per animation
 * frame, always using the most recent value.
 *
 * The callback is read from a ref at call time, so callers may pass an inline
 * closure without invalidating the throttled function identity.
 */
export function useRafThrottle<Value>(
  callback: (value: Value) => void,
): RafThrottled<Value> {
  const callbackRef = useRef(callback)
  const pendingRef = useRef<Value | null>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    pendingRef.current = null
  }, [])

  const flush = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
    const pending = pendingRef.current
    pendingRef.current = null
    if (pending !== null) callbackRef.current(pending)
  }, [])

  useEffect(() => cancel, [cancel])

  const schedule = useCallback((value: Value) => {
    pendingRef.current = value
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      const pending = pendingRef.current
      pendingRef.current = null
      if (pending !== null) callbackRef.current(pending)
    })
  }, [])

  return useMemo(
    () =>
      Object.assign(schedule, {
        flush,
        cancel,
      }),
    [schedule, flush, cancel],
  )
}