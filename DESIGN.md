---
name: RentMotor
colors:
  surface: "#f7f9fb"
  surface-dim: "#d8dadc"
  surface-bright: "#f7f9fb"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f2f4f6"
  surface-container: "#eceef0"
  surface-container-high: "#e6e8ea"
  surface-container-highest: "#e0e3e5"
  on-surface: "#191c1e"
  on-surface-variant: "#45474c"
  inverse-surface: "#2d3133"
  inverse-on-surface: "#eff1f3"
  outline: "#75777d"
  outline-variant: "#c5c6cd"
  surface-tint: "#545f73"
  primary: "#091426"
  on-primary: "#ffffff"
  primary-container: "#1e293b"
  on-primary-container: "#8590a6"
  inverse-primary: "#bcc7de"
  secondary: "#0058be"
  on-secondary: "#ffffff"
  secondary-container: "#2170e4"
  on-secondary-container: "#fefcff"
  tertiary: "#280c00"
  on-tertiary: "#ffffff"
  tertiary-container: "#481b00"
  on-tertiary-container: "#eb6905"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#d8e3fb"
  primary-fixed-dim: "#bcc7de"
  on-primary-fixed: "#111c2d"
  on-primary-fixed-variant: "#3c475a"
  secondary-fixed: "#d8e2ff"
  secondary-fixed-dim: "#adc6ff"
  on-secondary-fixed: "#001a42"
  on-secondary-fixed-variant: "#004395"
  tertiary-fixed: "#ffdbca"
  tertiary-fixed-dim: "#ffb690"
  on-tertiary-fixed: "#341100"
  on-tertiary-fixed-variant: "#783200"
  background: "#f7f9fb"
  on-background: "#191c1e"
  surface-variant: "#e0e3e5"
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
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
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: "700"
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The brand personality is **reliable, efficient, and adventurous**. This design system targets urban commuters and travelers who value speed and trust in their transit solutions. The UI evokes a sense of "premium utility"—where every element feels intentional, high-performance, and sturdy.

We adopt a **Corporate / Modern** style with a focus on **Minimalism**. This ensures that the complex steps of a motorbike rental (verification, availability checks, payments) feel lightweight and manageable. The aesthetic is defined by high-quality typography, generous whitespace to reduce cognitive load, and subtle tonal depth to guide the user through the rental lifecycle.

## Colors

The palette is anchored by **Slate Navy** (#1E293B) to provide a foundation of authority and professional trust.

- **Primary:** Slate Navy is used for main navigation, primary buttons, and headings.
- **Secondary:** Electric Blue (#3B82F6) is used for interaction states, progress indicators, and informational icons, reflecting the digital-first nature of the service.
- **Accent:** Safety Orange (#F97316) is used sparingly for high-urgency CTAs (like "Book Now") or critical status alerts, drawing the eye to the most important conversion points.
- **Neutral:** A spectrum of cool greys provides the background and container layering, ensuring a clean and airy interface.

## Typography

This design system utilizes **Inter** exclusively to maintain a systematic and utilitarian feel. The hierarchy is strictly enforced to ensure readability during the fast-paced booking process.

- **Headlines:** Use Bold weights with slight negative letter-spacing for a compact, authoritative look.
- **Body:** Standardized at 16px for optimal legibility. Use Medium weight for emphasis rather than Italics.
- **Labels:** Small, uppercase labels are used for "Steps" or "Specifications" (e.g., Engine CC, Fuel Type) to provide secondary information without cluttering the primary flow.

## Layout & Spacing

The system uses a **Fluid Grid** model based on a 12-column desktop layout.

- **Desktop:** 12 columns, 24px gutters, and 48px page margins.
- **Tablet:** 8 columns, 16px gutters, 24px margins.
- **Mobile:** 4 columns, 16px gutters, 16px margins.

We use an 8px spacing rhythm. Vertical rhythm should be generous to accommodate the "plenty of whitespace" requirement. Sections should be separated by `xl` (48px) or double `xl` (96px) units to allow the motorbike photography to breathe and stand out.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. We avoid heavy borders in favor of subtle surface shifts.

1.  **Level 0 (Base):** Neutral background (#F8FAFC).
2.  **Level 1 (Cards/Containers):** Pure white background with a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.05)).
3.  **Level 2 (Interactive/Floating):** Used for navigation bars and active modals. Shadows are more pronounced (0px 10px 30px rgba(0,0,0,0.1)) to indicate they sit high above the base.

Outlines are used only for input fields and secondary buttons, using a light slate (#E2E8F0) to maintain a soft, modern appearance.

## Shapes

The shape language is **Rounded**, strike a balance between friendly and professional.

- **Standard Buttons & Inputs:** 0.5rem (8px) radius.
- **Cards & Large Containers:** 1rem (16px) radius to create a distinct frame for content.
- **Search Bars & Status Chips:** 1.5rem (24px) or fully pill-shaped to denote search or temporary state.

This consistent radius ensures the UI feels approachable while maintaining the structural integrity of a professional rental platform.

## Components

### Buttons

- **Primary:** Navy background, white text. High-contrast for final actions like "Confirm Booking."
- **Secondary:** White background, Navy border. Used for "Cancel" or "View Details."
- **Ghost:** No background/border, Blue text. Used for less critical navigation.

### Input Fields

- Structured with a 1px Slate border and a subtle internal shadow when focused. Include clear placeholder text and trailing icons for specific data types (e.g., a calendar icon for date selection).

### Status Chips

- Representing the flowchart stages: Use a background tint of the status color (e.g., light green for "Available," light red for "Not Available") with high-contrast text and a left-aligned dot icon.

### Cards

- **Motorbike Card:** Top-aligned image, followed by a bold title, a horizontal list of specs (label-sm), and a primary price-per-day indicator at the bottom right.

### Step Indicator (Progress)

- A vertical or horizontal stepper following the flowchart logic. Completed steps use the Secondary Blue; the active step uses a pulsing blue outline.
