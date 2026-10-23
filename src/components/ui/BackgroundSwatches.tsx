import type { BackgroundPreset } from "../../services/presets"

function extractUrl(value: string): string | null {
  if (!value.startsWith("url(")) return null
  const match = value.match(/url\(['"]?([^'"]+?)['"]?\)/)
  return match ? match[1] : null
}

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
        const imageUrl = extractUrl(value)

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
            style={
              imageUrl
                ? {
                    backgroundImage: `url("${imageUrl}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
                : { background: value }
            }
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={label}
                className="swatch-thumbnail-img"
                loading="lazy"
                decoding="async"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}