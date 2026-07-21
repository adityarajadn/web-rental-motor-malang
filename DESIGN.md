---
name: Frosted Velocity
colors:
  surface: "#f9f9ff"
  surface-dim: "#cfdaf2"
  surface-bright: "#f9f9ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f0f3ff"
  surface-container: "#e7eeff"
  surface-container-high: "#dee8ff"
  surface-container-highest: "#d8e3fb"
  on-surface: "#111c2d"
  on-surface-variant: "#3c494e"
  inverse-surface: "#263143"
  inverse-on-surface: "#ecf1ff"
  outline: "#6c797f"
  outline-variant: "#bbc9cf"
  surface-tint: "#00677f"
  primary: "#00677f"
  on-primary: "#ffffff"
  primary-container: "#00d1ff"
  on-primary-container: "#00566a"
  inverse-primary: "#4cd6ff"
  secondary: "#4648d4"
  on-secondary: "#ffffff"
  secondary-container: "#6063ee"
  on-secondary-container: "#fffbff"
  tertiary: "#a43073"
  on-tertiary: "#ffffff"
  tertiary-container: "#ffa5cf"
  on-tertiary-container: "#8f1e62"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#b7eaff"
  primary-fixed-dim: "#4cd6ff"
  on-primary-fixed: "#001f28"
  on-primary-fixed-variant: "#004e60"
  secondary-fixed: "#e1e0ff"
  secondary-fixed-dim: "#c0c1ff"
  on-secondary-fixed: "#07006c"
  on-secondary-fixed-variant: "#2f2ebe"
  tertiary-fixed: "#ffd8e7"
  tertiary-fixed-dim: "#ffafd3"
  on-tertiary-fixed: "#3d0026"
  on-tertiary-fixed-variant: "#85145a"
  background: "#f9f9ff"
  on-background: "#111c2d"
  surface-variant: "#d8e3fb"
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: "800"
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "800"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  glass-padding: 24px
---

## Brand & Style

The design system is built to evoke a sense of premium mobility and futuristic precision. It targets a modern, tech-savvy audience that values both high-performance machinery and seamless digital experiences. The visual narrative is driven by **Glassmorphism**, emphasizing transparency and depth to mirror the feeling of wind and speed. By utilizing multi-layered frosted surfaces and tactile interaction points, the UI achieves a "high-end hardware" feel, positioning the rental service as a sophisticated, boutique platform rather than a generic utility.

## Colors

The palette is centered around **Electric Blue**, a high-energy primary hue that signifies speed and electricity. This is supported by a secondary **Deep Indigo** and tertiary **Soft Pink** used sparingly in background mesh gradients to provide the necessary color bleed for glass effects.

The neutral palette consists of high-contrast slates for typography and deep blacks for structural elements. Surfaces are primarily defined by semi-transparent white (rgba 255, 255, 255, 0.4) to create the "frosted" effect against the vibrant background gradients.

## Typography

The typography system balances the friendly, open curves of **Plus Jakarta Sans** for headings and UI labels with the systematic clarity of **Inter** for long-form content.

To ensure maximum legibility over frosted glass panels, headlines utilize heavy weights (Bold/ExtraBold) and tight letter spacing. Body text maintains a slightly higher line height to prevent visual clutter against the blurred background noise. All functional labels use a semi-bold weight to stand out as interactive triggers.

## Layout & Spacing

The layout employs a **Fluid Grid** logic with generous safe areas to let the background mesh gradients breathe. Elements are organized into "Glass Containers" which act as the primary grouping mechanism.

- **Desktop:** A 12-column grid with wide margins to center the focus on the motorbike imagery.
- **Mobile:** A single-column stack with condensed gutters, ensuring the glass panels hit the edges of the viewport to maximize the blur surface area.
- **Rhythm:** An 8px linear scale is used for all internal spacing. Glass panels should feature internal padding of at least 24px to prevent content from crowding the delicate translucent borders.

## Elevation & Depth

Depth in this design system is achieved through **optical layers** rather than traditional drop shadows.

1.  **Base Layer:** Soft, multi-color mesh gradients (Blue/Purple/White).
2.  **Surface Layer:** `backdrop-filter: blur(20px)` with a 1px semi-transparent white border (opacity 0.5) to define the edge.
3.  **Floating Layer:** Elements like "Book Now" buttons use a soft, primary-tinted shadow (`box-shadow: 0 20px 40px rgba(0, 209, 255, 0.2)`) to appear physically raised above the glass.

Avoid dark, heavy shadows; use "Ambient Glows" that inherit the color of the primary accent or the background to maintain the airy, frosted aesthetic.

## Shapes

The shape language is unapologetically **Tactile and Organic**. High roundedness values (Pill-shaped) are applied to all primary containers, buttons, and input fields. This softness contrasts with the "hard" engineering of the motorbikes, making the digital interface feel approachable and premium.

- **Containers:** Use `rounded-3xl` (1.5rem / 24px) for main glass cards.
- **Action Elements:** Buttons and tags use a fully rounded/pill radius.
- **Imagery:** Hero images and bike thumbnails should follow the `rounded-3xl` radius to maintain visual harmony with the glass panels.

## Components

- **Glass Cards:** The core component. Must include a `backdrop-filter`, a 1px border-top/left for a "light-catching" edge, and a very subtle inner glow.
- **Primary Buttons:** Solid Electric Blue with white text. Use a slight hover-state scale-up (1.05x) to emphasize the tactile feel.
- **Input Fields:** Semi-transparent backgrounds (rgba 255, 255, 255, 0.2) with a focus state that brightens the border to solid white.
- **Bike Specification Chips:** Pill-shaped, translucent light-gray chips with high-contrast icons to display engine CC, weight, and fuel type.
- **Availability Toggle:** A custom-styled switch that feels like a physical toggle on a motorbike handlebar, using the primary accent color for the 'on' state.
- **Interactive Calendar:** A frosted overlay where the selected date range is highlighted with a gradient-fill matching the background mesh.
