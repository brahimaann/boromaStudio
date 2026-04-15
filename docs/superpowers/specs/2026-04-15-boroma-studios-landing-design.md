# Boroma Studios — Landing Page Design Spec

**Date:** 2026-04-15
**Stack:** Next.js (App Router) · Tailwind CSS · TypeScript
**Approach:** Hybrid — `HeroBackground` + `NavigationOverlay` components, shared root layout

---

## 1. Overview

A high-end minimalist landing page for Boroma Studios, a multidisciplinary creative/tech agency based in Minneapolis/Saint Paul. The aesthetic strictly follows the Supreme web interface: full-viewport media background, left-aligned monospace navigation overlaid in absolute position, no decorative elements. The landing page is a single cinematic surface — the video IS the page.

---

## 2. Architecture

### Component Structure

```
src/
  app/
    layout.tsx          ← root layout: font, metadata, NavigationOverlay
    page.tsx            ← landing page: HeroBackground only
    software/page.tsx   ← shell
    media/page.tsx      ← shell
    capabilities/page.tsx ← shell
    archive/page.tsx    ← shell
    about/page.tsx      ← shell
    contact/page.tsx    ← shell
    portal/page.tsx     ← shell
  components/
    HeroBackground.tsx  ← video + dark overlay
    NavigationOverlay.tsx ← nav links + social icons
public/
  afrobeat party vhs 6.22.24.mp4  ← hero video asset
```

### Component Responsibilities

**`HeroBackground`**
- Outer wrapper: `fixed inset-0 z-0` — establishes the fixed stacking context
- `<video>` inside: `absolute inset-0 w-full h-full object-cover`, `autoPlay muted loop playsInline`
- Dark overlay: `absolute inset-0 bg-black/50 z-10` — sits above video, below nav
- Props: `src: string`, `poster?: string`
- Used only on the landing page (`/`)

**`NavigationOverlay`** — `'use client'` (requires `usePathname()`)
- `position: fixed`, top-left, full viewport height, `z-index: 10`
- Padding: `pt-8 pl-7 pb-8`
- Internal layout: `flex flex-col justify-between h-full`
- Top section: wordmark + nav links
- Bottom section: social icons row (desktop only)
- Props: `links: NavLink[]`

**Root Layout (`app/layout.tsx`)**
- Loads `JetBrains Mono` via `next/font/google`
- Applies `font-mono bg-black text-white` to `<body>`
- Mounts `NavigationOverlay` — persists across all page transitions
- Interior pages receive left padding to clear the fixed nav column: `pl-48 md:pl-56`

**Landing Page (`app/page.tsx`)**
- Renders `<HeroBackground src="/hero.mp4" />` (see §9 for video rename)
- `<main className="h-screen w-screen">`
- No other content — HeroBackground is fixed-position and fills the viewport independently

---

## 3. Navigation

### Nav Links (exact strings, lowercase)

| Label | Path |
|---|---|
| software | /software |
| media | /media |
| capabilities | /capabilities |
| archive | /archive |
| about | /about |
| contact | /contact |
| portal | /portal |

Defined as a `const navLinks` array in `layout.tsx`, typed as `NavLink[]`:

```ts
type NavLink = { label: string; href: string }
```

Active route detected via `usePathname()` (requires `'use client'` on `NavigationOverlay`).

### Social Icons

Positioned at the bottom of the nav column. **Hidden on mobile** (`hidden md:flex`).

| Platform | Display | Link |
|---|---|---|
| Instagram | IG | placeholder `#` |
| YouTube | YT | placeholder `#` |
| Facebook | FB | placeholder `#` |
| Spotify | SP | placeholder `#` |
| App Store | AS | placeholder `#` |
| WeChat | WC | placeholder `#` |
| Weibo | WB | placeholder `#` |

Rendered as monospace uppercase abbreviations. Real URLs wired up separately when brand accounts are confirmed.

---

## 4. Visual Design

### Typography

| Element | Size | Letter-spacing | Case | Color |
|---|---|---|---|---|
| Wordmark ("boroma studios") | 10px | 3px | uppercase | `rgba(255,255,255,0.45)` |
| Nav links | 13px | 1.5px | lowercase | `#ffffff` |
| Social abbreviations | 9px | 1px | uppercase | `rgba(255,255,255,0.4)` |

Font: `JetBrains Mono` (weight 400, latin subset) via `next/font/google`.
Fallback: `ui-monospace, SFMono-Regular, monospace`.

### Color Palette

- Background: video dictates — VHS footage (`afrobeat party vhs 6.22.24.mp4`)
- Overlay: `bg-black/50` (50% opacity)
- Primary text: `#ffffff`
- Subdued text: `rgba(255,255,255,0.45)`
- No accent colors on this iteration (original red highlights were for Supreme-specific items that were replaced)

### Hover & Active States

- **Default:** `color: #ffffff`
- **Hover:** `color: rgba(255,255,255,0.45)`, transition `150ms ease`
- **Active route:** `color: rgba(255,255,255,0.45)` + `line-through` text decoration
- Active state determined by `usePathname()` exact match

---

## 5. Tailwind Configuration

One addition to `tailwind.config.ts`:

```ts
theme: {
  extend: {
    fontFamily: {
      mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  },
}
```

No custom colors, spacing, or breakpoints required. All layout utilities are standard Tailwind.

---

## 6. Interior Page Shells

Each shell page (`/software`, `/media`, `/capabilities`, `/archive`, `/about`, `/contact`, `/portal`) renders:

```tsx
export default function PageName() {
  return (
    <div className="min-h-screen pt-16 pl-48 md:pl-56 pr-8 pb-16">
      <h1 className="text-xs tracking-widest uppercase text-white/60 mb-8">page-name</h1>
      {/* content scaffold placeholder */}
    </div>
  )
}
```

**`/about`** additionally renders: `<p>Minneapolis / Saint Paul</p>`
**`/contact`** renders a form scaffold: scope field, budget tier select, submit button (UI only, no backend)
**`/portal`** renders a login form scaffold (UI only, no auth)

---

## 7. Metadata

```ts
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Boroma Studios',
  description: 'Multidisciplinary creative and engineering studio. Minneapolis / Saint Paul.',
}
```

---

## 8. Out of Scope (This Pass)

- Contact form backend / email routing
- Portal authentication (no auth provider wired)
- Interior page real content (all shells)
- Social icon real URLs (placeholders only)
- SEO / OG image
- Animations beyond CSS hover transitions

---

## 9. File Naming Note

The video file `afrobeat party vhs 6.22.24.mp4` contains spaces and special characters. It must be placed in `public/` and referenced in code with URL encoding: `/afrobeat%20party%20vhs%206.22.24.mp4`, or renamed to `hero.mp4` for simplicity. **Recommendation: rename to `hero.mp4`** at project setup to avoid encoding issues across environments.
