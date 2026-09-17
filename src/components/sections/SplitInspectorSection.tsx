import { memo } from "react"
import { MAX_RADIUS, MIN_RADIUS } from "../../services/constants"
import {
  isDerivedSectionProperty,
  SPLIT_SECTION_CONTROLS,
  withLayoutProperty,
} from "../../services/layout"
import type { AppearanceSettings, SectionLayout } from "../../types"
import { RangeInput } from "../ui/RangeInput"

/**
 * Inspector for the two split hero sections. Section 2's horizontal size and
 * position are derived from section 1, so those sliders render as automatic.
 */
export const SplitInspectorSection = memo(function SplitInspectorSection({
  sections,
  activeSection,
  sectionRadius,
  onSelectSection,
  onResizeSection,
  onAppearanceChange,
}: {
  sections: SectionLayout[]
  activeSection: number
  sectionRadius: number
  onSelectSection: (index: number) => void
  onResizeSection: (index: number, layout: SectionLayout) => void
  onAppearanceChange: (patch: Partial<AppearanceSettings>) => void
}) {
  const layout = sections[activeSection]

  return (
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
          onClick={() => onSelectSection(0)}
        >
          Section 1
        </button>
        <button
          type="button"
          aria-pressed={activeSection === 1}
          className={activeSection === 1 ? "active" : ""}
          onClick={() => onSelectSection(1)}
        >
          Section 2
        </button>
      </div>

      <div className="dimension-controls">
        {SPLIT_SECTION_CONTROLS.map(({ property, label, min, max }) => {
          const automatic = isDerivedSectionProperty(activeSection, property)
          const value = layout[property]
          return (
            <label key={property} className={automatic ? "is-automatic" : ""}>
              <span>
                {label}
                <b>
                  {automatic
                    ? `Auto · ${Math.round(value)}%`
                    : `${Math.round(value)}%`}
                </b>
              </span>
              <RangeInput
                min={min}
                max={max}
                value={value}
                disabled={automatic}
                valueText={`${Math.round(value)} percent`}
                onChange={(next) =>
                  onResizeSection(
                    activeSection,
                    withLayoutProperty(layout, property, next),
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
        <RangeInput
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          value={sectionRadius}
          valueText={`${sectionRadius} pixels`}
          onChange={(radius) => onAppearanceChange({ sectionRadius: radius })}
        />
      </label>
    </section>
  )
})