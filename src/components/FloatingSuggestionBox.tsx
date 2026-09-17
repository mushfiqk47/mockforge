import { memo, useEffect, useRef, useState } from "react"
import {
  ChatBubbleIcon,
  ExternalLinkIcon,
  GitHubIcon,
  XBrandIcon,
} from "./icons"

const X_PROFILE_URL = "https://x.com/mushfiqk47"
const GITHUB_REPO_URL = "https://github.com/mushfiqk47/mockforge"
const QUICK_TAGS = [
  "+ New frame",
  "+ Video mockups",
  "+ 3D tilt",
  "+ Export format",
]

/**
 * Floating feedback pill. Owns its own open/close state so canvas and panel
 * re-renders never touch it.
 */
export const FloatingSuggestionBox = memo(function FloatingSuggestionBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const boxRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
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
        <dialog
          open
          className="floating-suggest-box"
          id="mockforge-suggest-dialog"
          aria-labelledby="suggest-title"
        >
          <div className="suggest-box-header">
            <div className="suggest-header-badges">
              <a
                href={X_PROFILE_URL}
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
                href={GITHUB_REPO_URL}
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
              {QUICK_TAGS.map((tag) => (
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
                href={X_PROFILE_URL}
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
        </dialog>
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