import studioMonitorFrame from "../Frame/studio_monitor_frame.jpg"
import mobileTallFrame from "../Frame/mobile_tall_frame.jpg"
import laptopProFrame from "../Frame/laptop_pro_frame.jpg"

/** A background preset: [css-class-suffix, human label, css background value]. */
export type BackgroundPreset = [name: string, label: string, value: string]

/** Backgrounds available for the canvas that hosts the frame. */
export const backgroundPresets: BackgroundPreset[] = [
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

/** Backgrounds available inside the frame, behind the screenshot. */
export const frameBgPresets: BackgroundPreset[] = [
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