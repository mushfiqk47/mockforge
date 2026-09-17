import { memo, useCallback, useState } from "react"
import type { ChangeEvent, DragEvent, RefObject } from "react"
import { IMAGE_INPUT_ID, IMAGE_UPLOAD_ACCEPT } from "../../services/constants"
import { UploadIcon } from "../icons"

/**
 * Upload control for the screenshot. `isDragging` is local because it only
 * affects this dropzone, and the file input is rendered here so the canvas can
 * open the same picker through the shared ref.
 */
export const ImagerySection = memo(function ImagerySection({
  images,
  fileInputRef,
  onImagesSelected,
  onRemoveImage,
}: {
  images: string[]
  fileInputRef: RefObject<HTMLInputElement | null>
  onImagesSelected: (files: FileList | File[]) => void
  onRemoveImage: (index: number) => void
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) onImagesSelected(event.target.files)
      event.target.value = ""
    },
    [onImagesSelected],
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setIsDragging(false)
      if (event.dataTransfer.files) onImagesSelected(event.dataTransfer.files)
    },
    [onImagesSelected],
  )

  return (
    <section className="tool-section" aria-label="Imagery">
      <div className="section-head">
        <span>Imagery</span>
        <span>{images.length}/1</span>
      </div>
      {images.length === 0 && (
        <button
          type="button"
          className={`dropzone ${isDragging ? "is-dragging" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <UploadIcon />
          <strong>Upload one image</strong>
          <small>JPG, PNG or WEBP · 10MB max</small>
        </button>
      )}
      <label className="sr-only" htmlFor={IMAGE_INPUT_ID}>
        Upload a website screenshot (JPG, PNG or WEBP, 10MB max)
      </label>
      <input
        ref={fileInputRef}
        id={IMAGE_INPUT_ID}
        type="file"
        accept={IMAGE_UPLOAD_ACCEPT}
        className="sr-only"
        onChange={handleFiles}
      />
      {images.length > 0 && (
        <div className="image-chips">
          {images.map((image, index) => (
            <div className="image-chip" key={image}>
              <img
                loading="lazy"
                decoding="async"
                src={image}
                alt="Selected upload"
              />
              <span>IMAGE 0{index + 1}</span>
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                onClick={() => onRemoveImage(index)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
})