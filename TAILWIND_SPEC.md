web application/stitch/projects/15770451649550650167/screens/d8d9c582903845a6b1d51206dfade040

# Technical Design Specification: VIVIENA Sleek Dark (Svelte + Tailwind CSS)

This document is prepared for an AI Developer Agent (Claude Opus 4.6) to implement the VIVIENA association website.

## 1. Brand Identity & Design Tokens

### Colors (Tailwind Config)

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#3951c1',    // Main Brand Blue
        secondary: '#879aff',  // Light Blue Accent
        dark: '#121212',       // Deep Background
        surface: '#1e1e1e',    // Card/Section Background
        text: '#e0e0e0',       // Primary Text
        muted: '#b0b0b0',      // Secondary/Muted Text
      }
    }
  }
}
```

### Typography

- **Primary Font:** Manrope (via Google Fonts)
- **Scale:**
  - `h1`: `text-5xl md:text-7xl font-extrabold tracking-tight`
  - `h2`: `text-3xl md:text-4xl font-bold`
  - `body`: `text-base leading-relaxed`

### Global Styles

- **Roundness:** `rounded-lg` (8px) or `rounded-2xl` (16px) for cards.
- **Shadows:** Subtle dark elevations `shadow-xl shadow-black/20`.

## 2. Component Architecture (Svelte Suggestions)

### Core Components:

- `Navbar.svelte`: Sticky header with logo and navigation.
- `Hero.svelte`: Main visual impact section with call to action.
- `FeatureCard.svelte`: Reusable card for "Obszary działań".
- `MemberCard.svelte`: Profile card for "Nasz zespół".
- `DocumentLink.svelte`: List item for legal/formal files.
- `Footer.svelte`: Multi-column footer with contact and legal info.

## 3. Implementation Guide for Claude

- Use `{{DATA:SCREEN:SCREEN_7}}` as the visual reference for layout and styling.
- All styles are implemented using Tailwind CSS utility classes.
- For interactive elements (buttons, mobile menu), use Svelte's reactive state (`let isOpen = false`).
- Icons: Use a consistent set like Lucide-Svelte or Heroicons.

## 4. Source Reference

The layout logic and spacing follow a max-width container of `1440px` with responsive padding (`px-4 md:px-12`).
