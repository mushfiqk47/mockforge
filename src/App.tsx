import { memo, useEffect, useRef, useState } from "react"
import type { ChangeEvent, DragEvent, PointerEvent } from "react"
import studioMonitorFrame from "./Frame/studio_monitor_frame.jpg"
import mobileTallFrame from "./Frame/mobile_tall_frame.jpg"
import laptopProFrame from "./Frame/laptop_pro_frame.jpg"

type Mode = "single" | "split"
type CropFocus = { x: number y: number }
type SectionLayout = { x: number y: number width: number height: number }
export type FrameType = "browser" | "mobile" | "laptop" | "tablet" | "monitor" | "none"
export type FrameFinish = "dark" | "silver" | "midnight"
export type FrameRatio = "auto" | "16-9" | "9-16" | "1-1" | "4-3"
export type FrameShadow = "deep" | "soft" | "glow" | "none"

const splitGap = 2

const backgroundPresets: [string, string, string][] = [
  ["white", "Pure White", "#ffffff"],
  ["light-gray", "Light Gray", "#f3f4f6"],
  ["solid", "Black background", "#111111"],
  [
    "ember",
    "Red glow gradient",
    "radial-gradient(circle at 80% 15%, #8d251f 0%, #1c1010 42%, #111111 100%)",
  ],
  [
    "violet",
    "Violet gradient",
    "linear-gradient(135deg, #111111 0%, #272041 52%, #6b275c 100%)",
  ],
  [
    "sunset",
    "Sunset gradient",
    "linear-gradient(135deg, #16100f 0%, #803326 52%, #e2a74b 100%)",
  ],
  [
    "ocean",
    "Ocean gradient",
    "linear-gradient(145deg, #061521 0%, #126e82 52%, #8ce3e0 100%)",
  ],
  [
    "cobalt",
    "Cobalt gradient",
    "linear-gradient(135deg, #09163a 0%, #2355d9 55%, #8fb3ff 100%)",
  ],
  [
    "orchid",
    "Orchid gradient",
    "linear-gradient(135deg, #25102e 0%, #9b3ca5 50%, #f7a6cb 100%)",
  ],
  [
    "forest",
    "Forest gradient",
    "linear-gradient(135deg, #071c16 0%, #25765f 55%, #a8d98c 100%)",
  ],
  [
    "sand",
    "Sand gradient",
    "linear-gradient(135deg, #2c2016 0%, #b77a45 55%, #f5ddb0 100%)",
  ],
  [
    "rose",
    "Rose gradient",
    "linear-gradient(135deg, #2b1016 0%, #c23d67 50%, #ffc0bd 100%)",
  ],
  [
    "slate",
    "Slate gradient",
    "linear-gradient(135deg, #111827 0%, #485569 52%, #d7dee6 100%)",
  ],
  [
    "lime",
    "Lime gradient",
    "linear-gradient(135deg, #111809 0%, #6e9833 52%, #e2ff7b 100%)",
  ],
  [
    "studio-3d",
    "Studio 3D backdrop",
    `url(${studioMonitorFrame}) center / cover no-repeat`,
  ],
  [
    "mobile-3d",
    "Mobile 3D backdrop",
    `url(${mobileTallFrame}) center / cover no-repeat`,
  ],
  [
    "laptop-3d",
    "Laptop 3D backdrop",
    `url(${laptopProFrame}) center / cover no-repeat`,
  ],
]

const frameBgPresets: [string, string, string][] = [
  ["white", "Pure White", "#ffffff"],
  ["solid", "Pure Black", "#000000"],
  ["light-gray", "Light Gray", "#f3f4f6"],
  ["zinc", "Dark Zinc", "#18181b"],
  [
    "ember",
    "Red glow gradient",
    "radial-gradient(circle at 80% 15%, #8d251f 0%, #1c1010 42%, #111111 100%)",
  ],
  [
    "violet",
    "Violet gradient",
    "linear-gradient(135deg, #111111 0%, #272041 52%, #6b275c 100%)",
  ],
  [
    "sunset",
    "Sunset gradient",
    "linear-gradient(135deg, #16100f 0%, #803326 52%, #e2a74b 100%)",
  ],
  [
    "ocean",
    "Ocean gradient",
    "linear-gradient(145deg, #061521 0%, #126e82 52%, #8ce3e0 100%)",
  ],
  [
    "cobalt",
    "Cobalt gradient",
    "linear-gradient(135deg, #09163a 0%, #2355d9 55%, #8fb3ff 100%)",
  ],
  [
    "orchid",
    "Orchid gradient",
    "linear-gradient(135deg, #25102e 0%, #9b3ca5 50%, #f7a6cb 100%)",
  ],
  [
    "forest",
    "Forest gradient",
    "linear-gradient(135deg, #071c16 0%, #25765f 55%, #a8d98c 100%)",
  ],
  [
    "sand",
    "Sand gradient",
    "linear-gradient(135deg, #2c2016 0%, #b77a45 55%, #f5ddb0 100%)",
  ],
  [
    "rose",
    "Rose gradient",
    "linear-gradient(135deg, #2b1016 0%, #c23d67 50%, #ffc0bd 100%)",
  ],
  [
    "slate",
    "Slate gradient",
    "linear-gradient(135deg, #111827 0%, #485569 52%, #d7dee6 100%)",
  ],
  [
    "lime",
    "Lime gradient",
    "linear-gradient(135deg, #111809 0%, #6e9833 52%, #e2ff7b 100%)",
  ],
]

function isLightColor(color: string): boolean {
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

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 12.5 12.5 3.5M5 3.5h7.5V11"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M4 14.5v4.25A2.25 2.25 0 0 0 6.25 21h11.5A2.25 2.25 0 0 0 20 18.75V14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunMoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
          ? `${className} lucide lucide-sun-moon`
          : "lucide lucide-sun-moon"
      }
      aria-hidden="true"
    >
      <path d="M12 2v2" />
      <path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715" />
      <path d="M16 12a4 4 0 0 0-4-4" />
      <path d="m19 5-1.256 1.256" />
      <path d="M20 12h2" />
    </svg>
  )
}

function BrandLogo() {
  return (
    <svg
      className="brand-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" />
      <rect
        x="5.5"
        y="5.5"
        width="7"
        height="13"
        rx="2"
        fill="var(--color-surface-panel)"
      />
      <rect
        x="14.5"
        y="5.5"
        width="4"
        height="13"
        rx="2"
        fill="var(--color-surface-panel)"
        opacity="0.65"
      />
    </svg>
  )
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4 6V4a4 4 0 1 1 8 0v2h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2zm2-2a2 2 0 1 1 4 0v2H6V4z"
      />
    </svg>
  )
}

function BrowserFrameIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="16" height="14" rx="2.5" />
      <line x1="2" y1="7.5" x2="18" y2="7.5" />
      <circle cx="4.5" cy="5.2" r="0.75" fill="currentColor" />
      <circle cx="7" cy="5.2" r="0.75" fill="currentColor" />
      <circle cx="9.5" cy="5.2" r="0.75" fill="currentColor" />
    </svg>
  )
}

function MobileFrameIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="5.5" y="2" width="9" height="16" rx="2.5" />
      <line x1="8.5" y1="4" x2="11.5" y2="4" strokeLinecap="round" />
      <line x1="8.5" y1="16" x2="11.5" y2="16" strokeLinecap="round" />
    </svg>
  )
}

function LaptopFrameIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3.5" y="3" width="13" height="9" rx="1.5" />
      <path d="M1.5 15h17l-1.5-2.5h-14L1.5 15z" strokeLinejoin="round" />
      <line x1="8" y1="12.5" x2="12" y2="12.5" />
    </svg>
  )
}

function TabletFrameIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3.5" y="2.5" width="13" height="15" rx="2.5" />
      <circle cx="10" cy="4.2" r="0.6" fill="currentColor" />
      <line x1="8.5" y1="16" x2="11.5" y2="16" strokeLinecap="round" />
    </svg>
  )
}

function MonitorFrameIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="16" height="11" rx="2" />
      <path d="M7 17h6M10 14v3" strokeLinecap="round" />
    </svg>
  )
}

function NoneFrameIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="14" height="14" rx="2" strokeDasharray="2 2" />
    </svg>
  )
}

function BrowserNavIcons() {
  return (
    <div className="browser-nav-group" aria-hidden="true">
      <span className="browser-nav-btn">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 3.5L5.5 8L10 12.5" />
        </svg>
      </span>
      <span className="browser-nav-btn nav-btn-disabled">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3.5L10.5 8L6 12.5" />
        </svg>
      </span>
      <span className="browser-nav-btn reload-btn">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13.2 7.8A5.2 5.2 0 1 1 11.6 4.1" />
          <polyline points="13.5 2.5 13.5 5.5 10.5 5.5" />
        </svg>
      </span>
    </div>
  )
}

function MobileStatusBar() {
  return (
    <div className="mobile-status-bar" aria-hidden="true">
      <span className="status-time">9:41</span>
      <div className="status-icons">
        <svg className="status-signal" viewBox="0 0 16 12" fill="currentColor">
          <rect x="1" y="8" width="2" height="4" rx="0.5" />
          <rect x="5" y="6" width="2" height="6" rx="0.5" />
          <rect x="9" y="3.5" width="2" height="8.5" rx="0.5" />
          <rect x="13" y="1" width="2" height="11" rx="0.5" />
        </svg>
        <svg className="status-wifi" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4.5 7.8a4.9 4.9 0 0 1 7 0 .8.8 0 1 0 1.1-1.1 6.5 6.5 0 0 0-9.2 0 .8.8 0 1 0 1.1 1.1zm-3-3a9.1 9.1 0 0 1 13 0 .8.8 0 0 0 1.1-1.1 10.7 10.7 0 0 0-15.2 0 .8.8 0 0 0 1.1 1.1z" />
        </svg>
        <div className="status-battery">
          <div className="battery-level" />
        </div>
      </div>
    </div>
  )
}

const frameOptions = [
  {
    id: "browser",
    label: "Browser",
    icon: BrowserFrameIcon,
    desc: "macOS Safari",
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: MobileFrameIcon,
    desc: "iPhone 16 Pro",
  },
  { id: "laptop", label: "Laptop", icon: LaptopFrameIcon, desc: "MacBook Pro" },
  { id: "tablet", label: "Tablet", icon: TabletFrameIcon, desc: "iPad Pro" },
  {
    id: "monitor",
    label: "Monitor",
    icon: MonitorFrameIcon,
    desc: "Studio Display",
  },
  { id: "none", label: "Frameless", icon: NoneFrameIcon, desc: "Edge-to-Edge" },
] as const

const finishOptions = [
  { id: "dark", label: "Dark Titanium", color: "#27272a" },
  { id: "silver", label: "Silver", color: "#d4d4d8" },
  { id: "midnight", label: "Midnight", color: "#1e293b" },
] as const

const ratioOptions = [
  { id: "auto", label: "Fit", desc: "Responsive auto" },
  { id: "16-9", label: "16:9", desc: "Desktop wide" },
  { id: "9-16", label: "9:16", desc: "Tall / Height" },
  { id: "4-3", label: "4:3", desc: "Classic display" },
  { id: "1-1", label: "1:1", desc: "Social square" },
] as const

export function MockupCanvas({
  mode,
  images,
  sections,
  activeSection,
  onActiveSectionChange,
  onSectionChange,
  primaryFocus,
  onPrimaryFocusChange,
  secondaryFocus,
  onSecondaryFocusChange,
  canvasBackground,
  sectionRadius,
  darkTheme,
  frameType,
  frameFinish,
  frameGlare,
  frameRatio,
  frameUrl,
  frameShadow,
  frameBackground,
  onUploadClick,
}: {
  mode: Mode
  images: string[]
  sections: SectionLayout[]
  activeSection: number
  onActiveSectionChange: (section: number) => void
  onSectionChange: (section: number, layout: SectionLayout) => void
  primaryFocus: CropFocus
  onPrimaryFocusChange: (focus: CropFocus) => void
  secondaryFocus: CropFocus
  onSecondaryFocusChange: (focus: CropFocus) => void
  canvasBackground: string
  sectionRadius: number
  darkTheme: boolean
  frameType: FrameType
  frameFinish: FrameFinish
  frameGlare: boolean
  frameRatio: FrameRatio
  frameUrl: string
  frameShadow: FrameShadow
  frameBackground: string
  onUploadClick?: () => void
}) {
  const primaryImage = images[0]
  const secondaryImage = images[1] || primaryImage
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggingDivider, setDraggingDivider] = useState(false)
  const [draggingCrop, setDraggingCrop] = useState(false)
  const activeCrop = useRef<{
    image: HTMLImageElement
    onChange: (focus: CropFocus) => void
    startX: number
    startY: number
    focus: CropFocus
  } | null>(null)

  const moveDivider = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingDivider || !canvasRef.current) return
    const { left, width } = canvasRef.current.getBoundingClientRect()
    onSectionChange(0, {
      ...sections[0],
      width: Math.max(25, Math.min(90, ((event.clientX - left) / width) * 100)),
    })
  }

  const moveCrop = (event: PointerEvent<HTMLElement>) => {
    if (!draggingCrop || !activeCrop.current) return
    const { image, onChange, startX, startY, focus } = activeCrop.current
    const { width, height } = image.getBoundingClientRect()
    onChange({
      x: Math.max(
        0,
        Math.min(100, focus.x - ((event.clientX - startX) / width) * 100),
      ),
      y: Math.max(
        0,
        Math.min(100, focus.y - ((event.clientY - startY) / height) * 100),
      ),
    })
  }

  const cropImageProps = (
    section: number,
    focus: CropFocus,
    onChange: (focus: CropFocus) => void,
  ) => ({
    className: "crop-photo",
    draggable: false,
    style: { objectPosition: `${focus.x}% ${focus.y}%` },
    onPointerDown: (event: PointerEvent<HTMLImageElement>) => {
      event.stopPropagation()
      onActiveSectionChange(section)
      event.currentTarget.setPointerCapture(event.pointerId)
      activeCrop.current = {
        image: event.currentTarget,
        onChange,
        startX: event.clientX,
        startY: event.clientY,
        focus,
      }
      setDraggingCrop(true)
    },
    onPointerMove: moveCrop,
    onPointerUp: () => {
      activeCrop.current = null
      setDraggingCrop(false)
    },
    onPointerCancel: () => {
      activeCrop.current = null
      setDraggingCrop(false)
    },
  })

  const renderContent = () => {
    if (mode === "split") {
      const hasAnyImage = Boolean(primaryImage)
      const isLight = isLightColor(frameBackground)
      return (
        <div
          className={`split-atlas-content ${isLight ? "is-light-bg" : ""}`}
          style={{
            background: frameBackground,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="atlas-pages">
            {[0, 1].map((index) => {
              const image =
                index === 0 ? primaryImage : secondaryImage || primaryImage
              return (
                <article
                  key={index}
                  className={`atlas-page ${
                    activeSection === index ? "is-selected" : ""
                  }`}
                  style={{
                    left: `${sections[index].x}%`,
                    top: `${sections[index].y}%`,
                    width: `${sections[index].width}%`,
                    height: `${sections[index].height}%`,
                    borderRadius: `${sectionRadius}px`,
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                  onPointerDown={() => onActiveSectionChange(index)}
                >
                  {image ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={image}
                      alt={`Uploaded website image, section ${index + 1}`}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      {...cropImageProps(
                        index,
                        index === 0 ? primaryFocus : secondaryFocus,
                        index === 0
                          ? onPrimaryFocusChange
                          : onSecondaryFocusChange,
                      )}
                    />
                  ) : !hasAnyImage ? (
                    <div
                      className="empty-split-section"
                      onClick={onUploadClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          onUploadClick?.()
                        }
                      }}
                      title="Click to upload an image"
                    >
                      <UploadIcon />
                      <span>Section {index + 1}</span>
                      <small style={{ fontSize: "10px", opacity: 0.7 }}>
                        {Math.round(sections[index].width)}% width · Upload
                      </small>
                    </div>
                  ) : null}
                  <div className="red-wash" />
                </article>
              )
            })}
          </div>
          <div
            className={`atlas-divider ${draggingDivider ? "is-active" : ""} ${
              isLight ? "is-light-bg" : ""
            }`}
            style={{ left: `${sections[0].x + sections[0].width}%` }}
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label="Split divider. Use left and right arrow keys to resize sections."
            aria-valuenow={Math.round(sections[0].width)}
            aria-valuemin={25}
            aria-valuemax={90}
            title="Drag to resize Section 1 horizontally"
            onPointerDown={(event) => {
              event.preventDefault()
              event.currentTarget.setPointerCapture(event.pointerId)
              onActiveSectionChange(0)
              setDraggingDivider(true)
            }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                return
              event.preventDefault()
              const delta = event.key === "ArrowLeft" ? -2 : 2
              const nextWidth = Math.max(
                25,
                Math.min(88, sections[0].width + delta),
              )
              onSectionChange(0, { ...sections[0], width: nextWidth })
            }}
          >
            <span className="divider-handle">
              <b />
              <b />
              <b />
            </span>
            <em className="divider-readout">
              S1 · {Math.round(sections[0].width)}%
            </em>
          </div>
        </div>
      )
    }

    if (!primaryImage) {
      return (
        <div
          className="empty-canvas-content"
          onClick={onUploadClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onUploadClick?.()
            }
          }}
          title="Click to upload an image"
          aria-label="Upload an image. Activate to choose a file."
        >
          <div className="empty-icon-wrap" aria-hidden="true">
            <UploadIcon />
          </div>
          <strong className="empty-title">Your image is the mockup.</strong>
          <span className="empty-subtitle">Upload one image to begin.</span>
          <span className="empty-upload-btn" aria-hidden="true">
            Upload image
          </span>
        </div>
      )
    }

    return (
      <div className="mockup-visual">
        <div
          className="image-panel"
          style={{ borderRadius: `${sectionRadius}px` }}
        >
          <img
            loading="lazy"
            decoding="async"
            src={primaryImage}
            alt="Primary uploaded website image"
            {...cropImageProps(0, primaryFocus, onPrimaryFocusChange)}
          />
          <div className="red-wash" />
        </div>
      </div>
    )
  }

  const renderFrameShell = () => {
    const content = renderContent()

    switch (frameType) {
      case "browser":
        return (
          <div
            className={`frame-shell frame-browser finish-${frameFinish}`}
            style={{ borderRadius: `${sectionRadius}px` }}
          >
            <div className="browser-titlebar">
              <div className="browser-titlebar-left">
                <div className="browser-dots" aria-hidden="true">
                  <span className="dot dot-red">
                    <i>×</i>
                  </span>
                  <span className="dot dot-yellow">
                    <i>−</i>
                  </span>
                  <span className="dot dot-green">
                    <i>+</i>
                  </span>
                </div>
                <BrowserNavIcons />
              </div>

              <div className="browser-address-pill">
                <LockIcon className="browser-lock-icon" />
                <span className="browser-url-text">
                  {frameUrl || "fitness-studio.io"}
                </span>
                <span className="browser-pill-badge">PRO</span>
              </div>

              <div className="browser-titlebar-right">
                <div className="browser-actions">
                  <span className="browser-action-btn" aria-hidden="true">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M8 2.5v7M5.5 5L8 2.5 10.5 5M3.5 9.5v3a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="browser-action-btn" aria-hidden="true">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M8 3.5v9M3.5 8h9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="frame-viewport-screen">
              {content}
              {frameGlare && (
                <div className="frame-glare-overlay" aria-hidden="true" />
              )}
            </div>
          </div>
        )

      case "mobile":
        return (
          <div className={`frame-shell frame-mobile finish-${frameFinish}`}>
            <div className="mobile-button-action" />
            <div className="mobile-button-vol-up" />
            <div className="mobile-button-vol-down" />
            <div className="mobile-button-power" />
            <div className="mobile-chassis-bezel">
              <MobileStatusBar />
              <div className="mobile-dynamic-island">
                <span className="island-camera" />
                <span className="island-sensor" />
              </div>
              <div className="frame-viewport-screen mobile-screen">
                {content}
                {frameGlare && (
                  <div className="frame-glare-overlay" aria-hidden="true" />
                )}
              </div>
              <div className="mobile-home-indicator-bar">
                <span className="home-bar" />
              </div>
            </div>
          </div>
        )

      case "laptop":
        return (
          <div className={`frame-shell frame-laptop finish-${frameFinish}`}>
            <div className="laptop-lid">
              <div className="laptop-top-bezel">
                <div className="laptop-camera-notch">
                  <span className="laptop-camera-lens" />
                </div>
              </div>
              <div className="frame-viewport-screen laptop-screen">
                {content}
                {frameGlare && (
                  <div className="frame-glare-overlay" aria-hidden="true" />
                )}
              </div>
            </div>
            <div className="laptop-base-deck">
              <div className="laptop-notch-indent" />
            </div>
          </div>
        )

      case "tablet":
        return (
          <div className={`frame-shell frame-tablet finish-${frameFinish}`}>
            <div className="tablet-button-power" />
            <div className="tablet-button-volume" />
            <div className="tablet-chassis-bezel">
              <div className="tablet-camera-dot">
                <span className="camera-glint" />
              </div>
              <div className="frame-viewport-screen tablet-screen">
                {content}
                {frameGlare && (
                  <div className="frame-glare-overlay" aria-hidden="true" />
                )}
              </div>
              <div className="tablet-home-indicator-bar">
                <span className="home-bar" />
              </div>
            </div>
          </div>
        )

      case "monitor":
        return (
          <div className={`frame-shell frame-monitor finish-${frameFinish}`}>
            <div className="monitor-display">
              <div className="monitor-top-bezel">
                <span className="monitor-camera-lens" />
                <span className="monitor-camera-led" />
              </div>
              <div className="frame-viewport-screen monitor-screen">
                {content}
                {frameGlare && (
                  <div className="frame-glare-overlay" aria-hidden="true" />
                )}
              </div>
              <div className="monitor-chin-bar">
                <span className="monitor-brand-dot" />
              </div>
            </div>
            <div className="monitor-stand-assembly">
              <div className="monitor-neck" />
              <div className="monitor-foot" />
            </div>
          </div>
        )

      case "none":
      default:
        return (
          <div
            className="frame-shell frame-none"
            style={{ borderRadius: `${sectionRadius}px` }}
          >
            <div
              className="frame-viewport-screen"
              style={{ borderRadius: `${sectionRadius}px` }}
            >
              {content}
              {frameGlare && (
                <div className="frame-glare-overlay" aria-hidden="true" />
              )}
            </div>
          </div>
        )
    }
  }

  const defaultCanvasBg = darkTheme ? "#18181c" : "#f9fafb"
  const effectiveBg =
    canvasBackground === "#111111"
      ? primaryImage || mode === "split"
        ? "#111111"
        : defaultCanvasBg
      : canvasBackground

  return (
    <div
      id="mockup-canvas"
      ref={canvasRef}
      tabIndex={-1}
      className={`mockup-canvas frame-mode-${frameType} finish-${frameFinish} ratio-${frameRatio} shadow-${frameShadow} ${
        !primaryImage && mode !== "split" ? "is-empty" : ""
      }`}
      style={
        {
          background: effectiveBg,
          "--frame-bg": frameBackground,
        } as React.CSSProperties
      }
      onPointerMove={(event) => {
        moveDivider(event)
        moveCrop(event)
      }}
      onPointerUp={() => {
        setDraggingDivider(false)
        setDraggingCrop(false)
      }}
      onPointerLeave={() => {
        setDraggingDivider(false)
        setDraggingCrop(false)
      }}
    >
      <div className="mockup-frame-container">{renderFrameShell()}</div>
    </div>
  )
}

function ChatBubbleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function XBrandIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function GitHubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function ExternalLinkIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

const FloatingSuggestionBox = memo(function FloatingSuggestionBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const boxRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)
  const xProfileUrl = "https://x.com/mushfiqk47"
  const githubRepoUrl = "https://github.com/mushfiqk47/mockforge"

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) closeBtnRef.current?.focus()
    if (!isOpen && wasOpenRef.current) fabRef.current?.focus()
    wasOpenRef.current = isOpen
  }, [isOpen])

  const handlePostOnX = () => {
    const text = suggestion.trim()
      ? `Hey @mushfiqk47, suggestion for MockForge: ${suggestion.trim()}`
      : `Hey @mushfiqk47, I have an idea for MockForge: `
    const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(tweetIntent, "_blank", "noopener,noreferrer")
  }

  const handleQuickTag = (tag: string) => {
    setSuggestion((prev) => (prev ? `${prev} · ${tag}` : tag))
  }

  return (
    <div ref={boxRef} className="floating-suggest-container no-export">
      {isOpen && (
        <div
          className="floating-suggest-box"
          id="mockforge-suggest-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="suggest-title"
        >
          <div className="suggest-box-header">
            <div className="suggest-header-badges">
              <a
                href={xProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="suggest-author-link"
                title="View @mushfiqk47 on X"
              >
                <span className="suggest-x-icon">
                  <XBrandIcon />
                </span>
                <span className="suggest-author-handle">@mushfiqk47</span>
              </a>
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="suggest-author-link suggest-github-link"
                title="View MockForge repository on GitHub"
              >
                <span className="suggest-github-icon">
                  <GitHubIcon />
                </span>
                <span className="suggest-author-handle">GitHub</span>
              </a>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              className="suggest-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close suggestion box"
            >
              ×
            </button>
          </div>

          <div className="suggest-box-body">
            <h3 className="suggest-title" id="suggest-title">
              Suggest Improvements
            </h3>
            <p className="suggest-subtitle">
              Have an idea, new frame request, or feedback? Share it directly on
              X with @mushfiqk47!
            </p>

            <label
              className="sr-only"
              htmlFor="suggest-textarea"
              id="suggest-textarea-label"
            >
              Describe your suggestion for MockForge
            </label>
            <textarea
              id="suggest-textarea"
              aria-labelledby="suggest-title suggest-textarea-label"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="What would make MockForge better for your workflow?"
              rows={3}
            />

            <div className="suggest-tags">
              {[
                "+ New frame",
                "+ Video mockups",
                "+ 3D tilt",
                "+ Export format",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="suggest-tag-chip"
                  onClick={() => handleQuickTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="suggest-actions">
              <button
                type="button"
                className="suggest-tweet-btn"
                onClick={handlePostOnX}
                title="Post this suggestion to @mushfiqk47 on X"
              >
                <XBrandIcon />
                <span>Post on X</span>
              </button>
              <a
                href={xProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="suggest-dm-link"
                title="Send a Direct Message to @mushfiqk47 on X"
              >
                <span>DM on X</span>
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        ref={fabRef}
        type="button"
        className={`floating-suggest-pill ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mockforge-suggest-dialog"
        aria-label={isOpen ? "Close suggestion box" : "Suggest improvements"}
        title="Suggest improvements or contact @mushfiqk47 on X"
      >
        <ChatBubbleIcon className="suggest-bubble-icon" />
        <span className="suggest-pill-text">Suggest Improvements</span>
      </button>
    </div>
  )
})

export default function App() {
  const [images, setImages] = useState<string[]>([])
  const [mode, setMode] = useState<Mode>("single")
  const [dragging, setDragging] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [sections, setSections] = useState<SectionLayout[]>([
    { x: 0, y: 0, width: 62, height: 100 },
    { x: 64, y: 0, width: 36, height: 100 },
  ])
  const [activeSection, setActiveSection] = useState(0)
  const [primaryFocus, setPrimaryFocus] = useState<CropFocus>({ x: 50, y: 50 })
  const [secondaryFocus, setSecondaryFocus] = useState<CropFocus>({
    x: 50,
    y: 50,
  })
  const [canvasBackground, setCanvasBackground] = useState("#111111")
  const [sectionRadius, setSectionRadius] = useState(14)
  const [darkTheme, setDarkTheme] = useState(true)

  // Preview Frame States
  const [frameType, setFrameType] = useState<FrameType>("browser")
  const [frameFinish, setFrameFinish] = useState<FrameFinish>("dark")
  const [frameGlare, setFrameGlare] = useState<boolean>(true)
  const [frameRatio, setFrameRatio] = useState<FrameRatio>("auto")
  const [frameUrl, setFrameUrl] = useState("fitness-pro.io")
  const [frameShadow, setFrameShadow] = useState<FrameShadow>("deep")

  // Frame interior background state
  const [frameBackground, setFrameBackground] = useState("#000000")

  const inputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)
  const frameBgInputRef = useRef<HTMLInputElement>(null)
  const imagesRef = useRef<string[]>([])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(
    () => () =>
      imagesRef.current.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url)
      }),
    [],
  )

  const handleFrameBgImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => {
      setFrameBackground(
        `url(${reader.result as string}) center / cover no-repeat`,
      )
    }
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  const addFiles = (files: FileList | File[]) => {
    const file = Array.from(files).find((item) =>
      item.type.startsWith("image/"),
    )
    if (!file) return
    setImages([URL.createObjectURL(file)])
  }

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files)
    event.target.value = ""
  }

  const drop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer.files) addFiles(event.dataTransfer.files)
  }

  const setBackgroundImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () =>
      setCanvasBackground(
        `url(${reader.result as string}) center / cover no-repeat`,
      )
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  const updateSection = (sectionIndex: number, layout: SectionLayout) =>
    setSections((current) => {
      const next = current.map((section, index) =>
        index === sectionIndex ? layout : section,
      )
      if (sectionIndex === 0) {
        const width = Math.max(25, Math.min(88, layout.width))
        const x = Math.max(0, Math.min(63, layout.x))
        next[0] = { ...layout, x, width }
        next[1] = {
          ...current[1],
          x: x + width + splitGap,
          width: Math.max(10, 100 - x - width - splitGap),
        }
      }
      return next
    })

  const selectedLayout = sections[activeSection]
  const updateSelectedLayout = (
    property: keyof SectionLayout,
    value: number,
  ) => {
    if (activeSection === 1 && (property === "width" || property === "x"))
      return
    updateSection(activeSection, { ...selectedLayout, [property]: value })
  }

  const canExport = Boolean(images[0]) || mode === "split"

  const exportCanvas = async () => {
    if (!canExport) return
    const node = document.getElementById("mockup-canvas")
    if (!node) return
    setExporting(true)
    const { toPng } = await import("html-to-image")
    node.classList.add("is-exporting")
    const canvasImages = Array.from(node.querySelectorAll("img"))
    const originalSources = canvasImages.map((image) => image.src)
    try {
      await Promise.all(
        canvasImages.map(async (image) => {
          if (!image.complete || !image.naturalWidth || !image.naturalHeight)
            return
          const snapshot = document.createElement("canvas")
          snapshot.width = image.naturalWidth
          snapshot.height = image.naturalHeight
          const context = snapshot.getContext("2d")
          if (!context) return
          context.drawImage(image, 0, 0)
          image.src = snapshot.toDataURL("image/png")
          try {
            await image.decode()
          } catch {}
        }),
      )
      const rect = node.getBoundingClientRect()
      const dataUrl = await toPng(node, {
        pixelRatio: Math.max(3, Math.min(4, 3840 / Math.max(rect.width, 1))),
        cacheBust: false,
        skipFonts: true,
        backgroundColor: "#111111",
        width: rect.width,
        height: rect.height,
        filter: (element) => !element.classList?.contains("atlas-divider"),
      })
      const link = document.createElement("a")
      link.download = `mockup-forge-${frameType}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Export failed", error)
    } finally {
      canvasImages.forEach((image, index) => {
        image.src = originalSources[index]
      })
      node.classList.remove("is-exporting")
      setExporting(false)
    }
  }

  const skipToPreview = () => {
    document
      .getElementById("mockup-canvas")
      ?.scrollIntoView({ behavior: "smooth", block: "center" })
    document.getElementById("mockup-canvas")?.focus()
  }

  return (
    <main className={`app-shell ${darkTheme ? "theme-dark" : ""}`}>
      <a
        href="#mockup-canvas"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault()
          skipToPreview()
        }}
      >
        Skip to preview
      </a>
      <aside className="control-panel" aria-label="Mockup controls">
        <div className="control-panel-scroll">
          <header className="brand-header">
            <div className="brand-identity">
              <BrandLogo />
              <h1 className="brand-name">MockForge</h1>
            </div>
            <div className="brand-header-actions">
              <a
                href="https://x.com/mushfiqk47"
                target="_blank"
                rel="noopener noreferrer"
                className="theme-icon-button brand-x-btn"
                title="Follow @mushfiqk47 on X"
                aria-label="Follow @mushfiqk47 on X"
              >
                <XBrandIcon className="theme-toggle-icon" />
              </a>
              <button
                type="button"
                className="theme-icon-button"
                onClick={() => setDarkTheme((value) => !value)}
                aria-label={
                  darkTheme ? "Switch to light theme" : "Switch to dark theme"
                }
                title={
                  darkTheme ? "Switch to light theme" : "Switch to dark theme"
                }
              >
                <SunMoonIcon className="theme-toggle-icon" />
              </button>
            </div>
          </header>

          {/* Imagery Section */}
          <section className="tool-section" aria-label="Imagery">
            <div className="section-head">
              <span>Imagery</span>
              <span>{images.length}/1</span>
            </div>
            {images.length === 0 && (
              <button
                type="button"
                className={`dropzone ${dragging ? "is-dragging" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDrop={drop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
              >
                <UploadIcon />
                <strong>Upload one image</strong>
                <small>JPG, PNG or WEBP · 10MB max</small>
              </button>
            )}
            <label className="sr-only" htmlFor="mockforge-upload">
              Upload a website screenshot (JPG, PNG or WEBP, 10MB max)
            </label>
            <input
              ref={inputRef}
              id="mockforge-upload"
              type="file"
              accept="image/*"
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
                      onClick={() =>
                        setImages((old) => old.filter((_, i) => i !== index))
                      }
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Format Section */}
          <section className="tool-section" aria-label="Format">
            <div className="section-head">
              <span>Format</span>
              <span>LIVE</span>
            </div>
            <div className="mode-toggle">
              <button
                type="button"
                aria-pressed={mode === "single"}
                className={mode === "single" ? "active" : ""}
                onClick={() => setMode("single")}
              >
                <span className="mode-icon single-icon" />
                Single hero
              </button>
              <button
                type="button"
                aria-pressed={mode === "split"}
                className={mode === "split" ? "active" : ""}
                onClick={() => setMode("split")}
              >
                <span className="mode-icon split-icon" />
                Split hero
              </button>
            </div>
          </section>

          {/* Preview Frame Section */}
          <section
            className="tool-section preview-frame-section"
            aria-label="Preview frame"
          >
            <div className="section-head">
              <span>Preview frame</span>
              <span>{frameType.toUpperCase()}</span>
            </div>

            {/* Frame Model Grid */}
            <div className="frame-type-grid">
              {frameOptions.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  type="button"
                  className={`frame-option-card ${
                    frameType === id ? "is-active" : ""
                  }`}
                  onClick={() => setFrameType(id)}
                  aria-pressed={frameType === id}
                  title={desc}
                >
                  <div className="frame-card-icon">
                    <Icon />
                  </div>
                  <span className="frame-card-label">{label}</span>
                </button>
              ))}
            </div>

            {/* Finish & Glare Row */}
            <div className="frame-subcontrol">
              <div className="subcontrol-head">
                <span>Finish & sheen</span>
                <b>{finishOptions.find((f) => f.id === frameFinish)?.label}</b>
              </div>
              <div className="finish-chips">
                {finishOptions.map(({ id, label, color }) => (
                  <button
                    key={id}
                    type="button"
                    className={`finish-chip ${
                      frameFinish === id ? "is-active" : ""
                    }`}
                    onClick={() => setFrameFinish(id)}
                    aria-pressed={frameFinish === id}
                    title={label}
                  >
                    <span
                      className="finish-color-dot"
                      style={{ background: color }}
                    />
                    {label.split(" ")[0]}
                  </button>
                ))}
                <button
                  type="button"
                  className={`glare-toggle-chip ${
                    frameGlare ? "is-active" : ""
                  }`}
                  onClick={() => setFrameGlare((v) => !v)}
                  aria-pressed={frameGlare}
                  title="Toggle 3D Screen Glass Sheen Reflection"
                >
                  <span className="glare-star">✦</span>
                  {frameGlare ? "Glare on" : "No glare"}
                </button>
              </div>
            </div>

            {/* Frame Height & Ratio */}
            <div className="frame-subcontrol">
              <div className="subcontrol-head">
                <span>Frame height & ratio</span>
                <b>
                  {frameRatio === "9-16"
                    ? "Tall / 9:16"
                    : frameRatio.toUpperCase()}
                </b>
              </div>
              <div className="ratio-chips">
                {ratioOptions.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    type="button"
                    className={`ratio-chip ${
                      frameRatio === id ? "is-active" : ""
                    }`}
                    onClick={() => setFrameRatio(id)}
                    aria-pressed={frameRatio === id}
                    title={`${label} · ${desc}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {frameType === "browser" && (
              <div className="frame-url-control">
                <label>
                  <span>Header URL</span>
                  <input
                    type="text"
                    value={frameUrl}
                    placeholder="e.g. fitness-pro.io"
                    onChange={(e) => setFrameUrl(e.target.value)}
                  />
                </label>
              </div>
            )}

            {/* Corner Radius Control */}
            <div className="frame-subcontrol">
              <div className="subcontrol-head">
                <span>Corner radius</span>
                <b>{sectionRadius}px</b>
              </div>
              <div className="radius-control-slider">
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={sectionRadius}
                  style={{
                    background: `linear-gradient(to right, var(--color-slider-fill) 0%, var(--color-slider-fill) ${(sectionRadius / 48) * 100}%, var(--color-slider-track) ${(sectionRadius / 48) * 100}%, var(--color-slider-track) 100%)`,
                  }}
                  aria-valuetext={`${sectionRadius} pixels`}
                  onChange={(event) =>
                    setSectionRadius(Number(event.target.value))
                  }
                  aria-label="Corner radius"
                />
                <div className="radius-quick-presets">
                  {[0, 8, 14, 24, 36].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`radius-preset-chip ${
                        sectionRadius === r ? "is-active" : ""
                      }`}
                      onClick={() => setSectionRadius(r)}
                      aria-pressed={sectionRadius === r}
                    >
                      {r === 0 ? "Square" : `${r}px`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="frame-subcontrol">
              <div className="subcontrol-head">
                <span>Frame elevation</span>
                <b>{frameShadow}</b>
              </div>
              <div className="shadow-chips">
                {(["deep", "soft", "glow", "none"] as const).map((shadow) => (
                  <button
                    key={shadow}
                    type="button"
                    className={`ratio-chip ${
                      frameShadow === shadow ? "is-active" : ""
                    }`}
                    onClick={() => setFrameShadow(shadow)}
                    aria-pressed={frameShadow === shadow}
                  >
                    {shadow.charAt(0).toUpperCase() + shadow.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Background Control */}
            <div className="frame-subcontrol">
              <div className="subcontrol-head">
                <span>Frame background</span>
                <b>{isLightColor(frameBackground) ? "Light" : "Dark"}</b>
              </div>
              <div className="background-controls">
                <label className="color-control">
                  <span>Frame custom color</span>
                  <input
                    type="color"
                    value={
                      frameBackground.startsWith("#")
                        ? frameBackground
                        : "#000000"
                    }
                    onChange={(event) => setFrameBackground(event.target.value)}
                  />
                </label>
                <div
                  className="gradient-options"
                  role="group"
                  aria-label="Frame background presets"
                >
                  {frameBgPresets.map(([name, label, value]) => (
                    <button
                      key={name}
                      type="button"
                      aria-label={`Frame background: ${label}`}
                      aria-pressed={frameBackground === value}
                      className={`background-swatch ${name} ${
                        frameBackground === value ? "is-selected-swatch" : ""
                      }`}
                      onClick={() => setFrameBackground(value)}
                      style={
                        value.startsWith("url")
                          ? { backgroundImage: value }
                          : {}
                      }
                    />
                  ))}
                </div>
                <div className="split-bg-actions-row">
                  <button
                    type="button"
                    className="background-upload split-upload-btn"
                    onClick={() => frameBgInputRef.current?.click()}
                  >
                    Upload frame BG
                  </button>
                  <button
                    type="button"
                    className="split-match-btn"
                    onClick={() => setFrameBackground(canvasBackground)}
                    title="Match frame background to canvas background"
                  >
                    Match canvas
                  </button>
                </div>
                <label className="sr-only" htmlFor="mockforge-frame-bg-upload">
                  Upload a custom frame background image
                </label>
                <input
                  ref={frameBgInputRef}
                  id="mockforge-frame-bg-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFrameBgImage}
                />
              </div>
            </div>
          </section>

          {/* Canvas Background Section */}
          <section
            className="tool-section background-picker"
            aria-label="Canvas background"
          >
            <div className="section-head">
              <span>Canvas background</span>
              <span>LIVE</span>
            </div>
            <div className="background-controls">
              <label className="color-control">
                <span>Custom color</span>
                <input
                  type="color"
                  value={
                    canvasBackground.startsWith("#")
                      ? canvasBackground
                      : "#111111"
                  }
                  onChange={(event) => setCanvasBackground(event.target.value)}
                />
              </label>
              <div
                className="gradient-options"
                role="group"
                aria-label="Canvas background presets"
              >
                {backgroundPresets.map(([name, label, value]) => (
                  <button
                    key={name}
                    type="button"
                    aria-label={`Canvas background: ${label}`}
                    aria-pressed={canvasBackground === value}
                    className={`background-swatch ${name} ${
                      canvasBackground === value ? "is-selected-swatch" : ""
                    }`}
                    onClick={() => setCanvasBackground(value)}
                    style={
                      value.startsWith("url") ? { backgroundImage: value } : {}
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                className="background-upload"
                onClick={() => backgroundInputRef.current?.click()}
              >
                Upload background
              </button>
              <label className="sr-only" htmlFor="mockforge-background-upload">
                Upload a custom canvas background image
              </label>
              <input
                ref={backgroundInputRef}
                id="mockforge-background-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={setBackgroundImage}
              />
            </div>
          </section>

          {/* Split Inspector Section */}
          {mode === "split" && (
            <section
              className="tool-section split-inspector"
              aria-label="Split section inspector"
            >
              <div className="section-head">
                <span>Split section</span>
                <span>S{activeSection + 1}</span>
              </div>
              <div className="section-tabs">
                <button
                  type="button"
                  aria-pressed={activeSection === 0}
                  className={activeSection === 0 ? "active" : ""}
                  onClick={() => setActiveSection(0)}
                >
                  Section 1
                </button>
                <button
                  type="button"
                  aria-pressed={activeSection === 1}
                  className={activeSection === 1 ? "active" : ""}
                  onClick={() => setActiveSection(1)}
                >
                  Section 2
                </button>
              </div>

              <div className="dimension-controls">
                {([
                  ["width", "Horizontal size", 25, 100],
                  ["height", "Vertical size", 25, 100],
                  ["x", "Horizontal position", 0, 85],
                  ["y", "Vertical position", 0, 75],
                ] as const).map(([property, label, min, max]) => {
                  const automatic =
                    activeSection === 1 &&
                    (property === "width" || property === "x")
                  const progress =
                    ((selectedLayout[property] - min) / (max - min)) * 100
                  return (
                    <label
                      key={property}
                      className={automatic ? "is-automatic" : ""}
                    >
                      <span>
                        {label}
                        <b>
                          {automatic
                            ? `Auto · ${Math.round(selectedLayout[property])}%`
                            : `${Math.round(selectedLayout[property])}%`}
                        </b>
                      </span>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={selectedLayout[property]}
                        disabled={automatic}
                        style={{
                          background: `linear-gradient(to right, var(--color-slider-fill) 0%, var(--color-slider-fill) ${progress}%, var(--color-slider-track) ${progress}%, var(--color-slider-track) 100%)`,
                        }}
                        aria-valuetext={`${Math.round(selectedLayout[property])} percent`}
                        onChange={(event) =>
                          updateSelectedLayout(
                            property,
                            Number(event.target.value),
                          )
                        }
                      />
                    </label>
                  )
                })}
              </div>
              <label className="radius-control">
                <span>
                  Both sections · corner radius <b>{sectionRadius}px</b>
                </span>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={sectionRadius}
                  style={{
                    background: `linear-gradient(to right, var(--color-slider-fill) 0%, var(--color-slider-fill) ${(sectionRadius / 48) * 100}%, var(--color-slider-track) ${(sectionRadius / 48) * 100}%, var(--color-slider-track) 100%)`,
                  }}
                  aria-valuetext={`${sectionRadius} pixels`}
                  onChange={(event) =>
                    setSectionRadius(Number(event.target.value))
                  }
                />
              </label>
            </section>
          )}
        </div>

        {/* Docked Export Footer */}
        <footer className="control-panel-footer">
          <button
            type="button"
            className="export-button"
            onClick={exportCanvas}
            disabled={exporting || !canExport}
            aria-disabled={exporting || !canExport}
            title={
              canExport
                ? "Export the preview as PNG"
                : "Upload an image or switch to split mode to enable export"
            }
          >
            {exporting ? "Rendering..." : "Export PNG"} <ArrowUpRight />
          </button>
          <p className="sr-only" role="status" aria-live="polite">
            {exporting
              ? "Rendering PNG export."
              : canExport
                ? "Preview ready. Export is available."
                : "Upload one image to begin. Export is disabled."}
          </p>
        </footer>
      </aside>

      {/* Stage Frame Area */}
      <section className="stage stage-ember" aria-label="Mockup preview">
        <div className="stage-frame">
          <MockupCanvas
            mode={mode}
            images={images}
            sections={sections}
            activeSection={activeSection}
            onActiveSectionChange={setActiveSection}
            onSectionChange={updateSection}
            primaryFocus={primaryFocus}
            onPrimaryFocusChange={setPrimaryFocus}
            secondaryFocus={secondaryFocus}
            onSecondaryFocusChange={setSecondaryFocus}
            canvasBackground={canvasBackground}
            sectionRadius={sectionRadius}
            darkTheme={darkTheme}
            frameType={frameType}
            frameFinish={frameFinish}
            frameGlare={frameGlare}
            frameRatio={frameRatio}
            frameUrl={frameUrl}
            frameShadow={frameShadow}
            frameBackground={frameBackground}
            onUploadClick={() => inputRef.current?.click()}
          />
          <div className="frame-corner top left" />
          <div className="frame-corner top right" />
          <div className="frame-corner bottom left" />
          <div className="frame-corner bottom right" />
        </div>
      </section>

      <FloatingSuggestionBox />
    </main>
  )
}
