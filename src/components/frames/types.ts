import type { CSSProperties, ReactNode } from "react"
import type { FrameFinish } from "../../types"

export type BaseFrameProps = {
  finish: FrameFinish
  glare: boolean
  url: string
  sectionRadius: number
  children: ReactNode
}

export type ScreenProps = {
  className?: string
  style?: CSSProperties
  glare: boolean
  children: ReactNode
}
