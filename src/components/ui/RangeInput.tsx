import type { CSSProperties } from "react"
import { sliderProgress } from "../../services/layout"

/**
 * Range input with a filled track.
 *
 * The fill is drawn with a background gradient derived from the current value,
 * which is the one piece of maths every slider in the panel shares.
 */
export function RangeInput({
  min,
  max,
  value,
  onChange,
  valueText,
  disabled = false,
  ariaLabel,
}: {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  valueText: string
  disabled?: boolean
  ariaLabel?: string
}) {
  const progress = sliderProgress(value, min, max)
  const style: CSSProperties = {
    background: `linear-gradient(to right, var(--color-slider-fill) 0%, var(--color-slider-fill) ${progress}%, var(--color-slider-track) ${progress}%, var(--color-slider-track) 100%)`,
  }

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
      aria-valuetext={valueText}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  )
}