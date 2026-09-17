/**
 * Decide whether a background value reads as "light" so the UI can flip its
 * contrast treatment. Gradients, images and unparsable values are treated as
 * dark, which matches every preset shipped in `presets.ts`.
 */
export function isLightColor(color: string): boolean {
  if (
    !color ||
    color.startsWith("linear") ||
    color.startsWith("radial") ||
    color.startsWith("url")
  )
    return false

  const trimmed = color.trim().toLowerCase()
  if (
    trimmed === "#fff" ||
    trimmed === "#ffffff" ||
    trimmed === "#f3f4f6" ||
    trimmed === "#f4f4f5" ||
    trimmed === "#fafafa"
  )
    return true

  const hex = trimmed.replace("#", "")
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 160
  }

  return false
}