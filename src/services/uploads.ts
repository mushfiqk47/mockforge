import { MAX_IMAGE_FILE_SIZE_BYTES } from "./constants"

/**
 * Image file helpers shared by every upload control.
 *
 * Hides the `FileReader` plumbing, the blob-URL lifecycle and the CSS value
 * format so components never touch raw file APIs.
 */

export function isImageFile(file: File | null | undefined): file is File {
  return Boolean(file && file.type.startsWith("image/"))
}

export function isFileSizeAcceptable(file: File | null | undefined): boolean {
  return Boolean(file && file.size <= MAX_IMAGE_FILE_SIZE_BYTES)
}

export function validateImageFile(file: File | null | undefined): {
  valid: boolean
  error?: string
} {
  if (!file) return { valid: false, error: "No file selected." }
  if (!isImageFile(file)) {
    return { valid: false, error: "Please upload a valid image file (JPG, PNG, or WEBP)." }
  }
  if (!isFileSizeAcceptable(file)) {
    return { valid: false, error: "Image file exceeds the 10MB limit." }
  }
  return { valid: true }
}

/** First valid image out of a drop or picker selection, or null when there is none. */
export function firstImageFile(
  files: FileList | File[] | null | undefined,
): File | null {
  if (!files) return null
  return Array.from(files).find((file) => isImageFile(file) && isFileSizeAcceptable(file)) ?? null
}

export function createImageObjectUrl(file: File): string {
  // Ownership transfers to useMockupState, which revokes on replace/remove/unmount.
  // eslint-disable-next-line react-doctor/no-create-object-url-without-revoke
  return URL.createObjectURL(file)
}

/** Revoke a blob URL, ignoring data URLs and external image sources. */
export function revokeObjectUrl(url: string): void {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url)
}

export function revokeObjectUrls(urls: readonly string[]): void {
  urls.forEach(revokeObjectUrl)
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read the image file"))
    reader.readAsDataURL(file)
  })
}

/** Inline a data URL as a CSS `background-image` value. */
export function toBackgroundImageValue(dataUrl: string): string {
  return `url(${dataUrl}) center / cover no-repeat`
}

/**
 * Read an uploaded file into a ready-to-apply CSS background value.
 * Returns null when the file could not be read or exceeds the maximum size.
 */
export async function loadBackgroundImage(file: File): Promise<string | null> {
  if (!isImageFile(file) || !isFileSizeAcceptable(file)) return null
  try {
    return toBackgroundImageValue(await readFileAsDataUrl(file))
  } catch {
    return null
  }
}
