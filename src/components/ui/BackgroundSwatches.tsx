import type { BackgroundPreset } from "../../services/presets"

/**
 * Swatch grid for background presets.
 *
 * A preset value may be a colour, a gradient or a `url(...)` background, so the
 * swatch itself only needs to know how to highlight the active one.
 */
export function BackgroundSwatches({
  presets,
  selected,
  onSelect,
  groupLabel,
  itemLabelPrefix,
}: {
  presets: BackgroundPreset[]
  selected: string
  onSelect: (value: string) => void
  groupLabel: string
  itemLabelPrefix: string
}) {
  return (
    <div className="gradient-options" role="group" aria-label={groupLabel}>
      {presets.map(([name, label, value]) => {
        const isSelected = selected === value
        return (
          <button
            key={name}
            type="button"
            aria-label={`${itemLabelPrefix}: ${label}`}
            aria-pressed={isSelected}
            className={`background-swatch ${name} ${
              isSelected ? "is-selected-swatch" : ""
            }`}
            onClick={() => onSelect(value)}
            style={value.startsWith("url") ? { backgroundImage: value } : {}}
          />
        )
      })}
    </div>
  )
}