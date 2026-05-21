# Design System Strategy: Stowarzyszenie VIVIENA

## 1. Overview & Creative North Star

**Creative North Star: "The Architectural Academic"**
The design system for VIVIENA is built to bridge the gap between youthful energy and professional authority. We reject the "standard NGO" template in favor of a high-end editorial experience. By utilizing intentional asymmetry, expansive negative space, and a sophisticated layering system, we create a digital environment that feels curated and precise.

The "Architectural Academic" approach treats the screen like a physical gallery-elements overlap, surfaces breathe, and typography is used as a structural element rather than just a vehicle for information. This reflects VIVIENA’s mission: a structured, professional foundation that empowers dynamic, youth-driven initiatives.

---

## 2. Colors & Surface Philosophy

The palette is anchored in the signature VIVIENA Blue (`primary: #3951c1`), but its application is nuanced. We avoid flat, monochromatic blocks in favor of tonal depth.

### The "No-Line" Rule

Traditional 1px borders are strictly prohibited for sectioning or containment. Boundaries must be defined through:

- **Tonal Shifts:** Placing a `surface-container-low` section against a `surface` background.
- **Vast Negative Space:** Using the `24 (8.5rem)` spacing token to separate distinct content blocks.

### Surface Hierarchy & Nesting

Treat the interface as stacked sheets of fine paper.

- **Base:** `surface` (#f9f5ff)
- **Level 1 (Sections):** `surface-container-low` (#f2eeff)
- **Level 2 (Interactive Cards):** `surface-container-lowest` (#ffffff) to create a subtle "lift" against the background.
- **Level 3 (Floating Elements):** Use `surface-bright` with Glassmorphism.

### The "Glass & Gradient" Rule

To inject "soul" into the professional aesthetic:

- **CTAs & Heros:** Use subtle linear gradients from `primary` (#3951c1) to `primary-container` (#879aff) at a 135-degree angle.
- **Overlays:** Apply `backdrop-blur: 12px` to containers using semi-transparent `surface-container-highest` to allow brand colors to bleed through, softening the visual hierarchy.

---

## 3. Typography

We utilize a dual-typeface system to balance editorial sophistication with high readability.

- **Display & Headlines (Manrope):** Chosen for its geometric clarity and modern "tech-humanist" feel.
- _Application:_ Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) for hero sections to create an authoritative, "bold-start" look.
- **Body & Labels (Inter):** The industry standard for digital legibility.
- _Application:_ Use `body-lg` (1rem) for long-form educational content. All labels (`label-md`) should be set in Uppercase with +0.05em tracking to differentiate them from body text.

The hierarchy is intentional: headlines command attention, while body text provides a calm, airy reading experience.

---

## 4. Elevation & Depth

Depth is a psychological cue for importance. We use "Tonal Layering" instead of heavy shadows.

- **The Layering Principle:** Place `surface-container-lowest` cards on a `surface-container` background. The slight change in hex value creates a "Soft Lift" that feels high-end and intentional.
- **Ambient Shadows:** For floating modals or navigation, use extra-diffused shadows: `box-shadow: 0 20px 40px rgba(44, 42, 81, 0.06)`. Note the use of the `on-surface` color (#2c2a51) for the shadow tint-never use pure black.
- **The Ghost Border:** If a visual anchor is needed for accessibility, use the `outline-variant` (#aba8d7) at **15% opacity**. This provides a "suggestion" of a boundary without breaking the airy aesthetic.

---

## 5. Components

### Buttons

- **Primary:** Gradient fill (`primary` to `primary-container`), `full` roundedness, and `headline-sm` typography.
- **Secondary:** Ghost style. No background. Use a "Ghost Border" (15% opacity `outline-variant`) and `primary` text.
- **Interaction:** On hover, the button should scale by 1.02 and the shadow should slightly deepen.

### Input Fields

- **Style:** Minimalist. No bottom line or box. Use `surface-container-high` as a subtle background fill.
- **States:** On focus, transition the background to `surface-container-highest` and add a 2px `primary` left-border accent to denote activity.

### Cards & Lists

- **Rule:** Forbid divider lines.
- **Implementation:** Separate list items using `spacing-4` (1.4rem) of vertical white space. For cards, use the Tonal Layering Principle mentioned in Section 4.

### Glass Action Chips

- **Context:** Used for filtering educational topics.
- **Style:** Semi-transparent `surface-variant` with a 10px backdrop-blur. This creates a "premium-tech" feel suitable for a youth-led organization.

---

## 6. Do's and Don'ts

### Do

- **DO** use intentional asymmetry. Place a `display-lg` headline on the left and a `body-lg` paragraph offset to the right.
- **DO** use the `20` and `24` spacing tokens between major sections to let the design breathe.
- **DO** use `tertiary` (#923881) sparingly as an "Energetic Accent" for small UI elements like notification dots or active tab underlines.

### Don't

- **DON'T** use 1px solid, high-contrast borders. It cheapens the "Architectural" feel.
- **DON'T** use standard drop shadows. If it looks like a "Material Design 1" shadow, it’s too heavy.
- **DON'T** crowd content. If you feel the need to add a divider, add 2rem of white space instead.
- **DON'T** use the Dark Mode `inverse_surface` for everything in dark mode. Use the container tiers to maintain the same "Paper-like" layering logic as the light mode.
