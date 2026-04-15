# Boroma Studios — Landing Page Design Spec

**Date:** 2026-04-15
**Stack:** Next.js (App Router) · Tailwind CSS · TypeScript
**Approach:** Hybrid — `HeroBackground` + `NavigationOverlay` components, shared root layout

---

## 1. Overview

A high-end minimalist landing page for Boroma Studios, a multidisciplinary creative/tech agency based in Minneapolis/Saint Paul. The aesthetic fuses two typographic registers: large bold Bebas Neue display type for navigation items (centered full-screen) and JetBrains Mono for all secondary/peripheral text (wordmark, socials, labels). The video VHS footage is the background on the landing page. The nav overlay is togglable — open by default on the landing page, closed by default on interior pages (revealed via a small trigger).

---

## 2. Architecture

### Component Structure

```
src/
  app/
    layout.tsx              ← root layout: fonts, metadata, NavigationOverlay
    page.tsx                ← landing page: HeroBackground + defaultOpen nav
    software/page.tsx       ← shell
    media/page.tsx          ← shell
    capabilities/page.tsx   ← shell
    archive/page.tsx        ← shell
    about/page.tsx          ← shell
    contact/page.tsx        ← shell
    portal/page.tsx         ← shell
  components/
    HeroBackground.tsx      ← fixed video + dark overlay (landing page only)
    NavigationOverlay.tsx   ← full-screen centered bold nav, togglable
public/
  hero.mp4                  ← hero video (renamed from original)
```

### Component Responsibilities

**`HeroBackground`**
- Outer wrapper: `fixed inset-0 z-0` — establishes the fixed stacking context
- `<video>` inside: `absolute inset-0 w-full h-full object-cover`, `autoPlay muted loop playsInline`
- Dark overlay: `absolute inset-0 bg-black/50 z-10` — sits above video, below nav
- Props: `src: string`, `poster?: string`
- Used only on the landing page (`/`)

**`NavigationOverlay`** — `'use client'`
- Full-screen fixed overlay: `fixed inset-0 z-20 bg-black/80 flex flex-col items-center justify-center`
- When closed: replaced by a small persistent trigger — `fixed top-7 left-7 z-20`, wordmark in JetBrains Mono clicking opens the overlay
- Props: `links: NavLink[]`, `defaultOpen?: boolean` (true on landing, false on interior pages)
- Internal state: `isOpen: boolean` initialized from `defaultOpen`
- **Open state** renders:
  - Centered column of nav links in Bebas Neue, large, uppercase
  - "boroma studios" wordmark — `fixed top-7 left-7` in JetBrains Mono
  - "close" button — `fixed top-7 right-7` in JetBrains Mono (sets `isOpen = false`)
  - Social icons — `fixed bottom-7 left-7`, `hidden md:flex`, JetBrains Mono abbreviations
- **Closed state** renders:
  - Wordmark only — `fixed top-7 left-7` in JetBrains Mono, clicking sets `isOpen = true`

**Root Layout (`app/layout.tsx`)**
- Loads `JetBrains Mono` (weight 400) + `Bebas Neue` (weight 400) via `next/font/google`
- Applies `bg-black text-white` to `<body>`
- Does NOT mount `NavigationOverlay` — each page controls `defaultOpen`
- `NavigationOverlay` is mounted individually per page so landing can pass `defaultOpen={true}`

**Landing Page (`app/page.tsx`)**
- `<HeroBackground src="/hero.mp4" />`
- `<NavigationOverlay links={navLinks} defaultOpen={true} />`
- `<main className="h-screen w-screen" />`

**Interior Pages**
- `<NavigationOverlay links={navLinks} defaultOpen={false} />` at top of each shell
- Content in `<div className="min-h-screen pt-20 px-8 pb-16">`

---

## 3. Navigation

### Nav Links (exact display strings, uppercase in Bebas Neue)

| Display | Path |
|---|---|
| SOFTWARE | /software |
| MEDIA | /media |
| CAPABILITIES | /capabilities |
| ARCHIVE | /archive |
| ABOUT | /about |
| CONTACT | /contact |
| PORTAL | /portal |

Labels stored lowercase in the `navLinks` array — component renders them uppercase via CSS `uppercase` class. Active route detected via `usePathname()` exact match.

```ts
type NavLink = { label: string; href: string }

const navLinks: NavLink[] = [
  { label: 'software', href: '/software' },
  { label: 'media', href: '/media' },
  { label: 'capabilities', href: '/capabilities' },
  { label: 'archive', href: '/archive' },
  { label: 'about', href: '/about' },
  { label: 'contact', href: '/contact' },
  { label: 'portal', href: '/portal' },
]
```

### Social Icons

Fixed bottom-left when nav is open. **Hidden on mobile** (`hidden md:flex`).

| Platform | Display | Link |
|---|---|---|
| Instagram | IG | placeholder `#` |
| YouTube | YT | placeholder `#` |
| Facebook | FB | placeholder `#` |
| Spotify | SP | placeholder `#` |
| App Store | AS | placeholder `#` |
| WeChat | WC | placeholder `#` |
| Weibo | WB | placeholder `#` |

Rendered as JetBrains Mono uppercase abbreviations separated by ` · `.

---

## 4. Visual Design

### Typography — Two Font Registers

| Element | Font | Size | Letter-spacing | Case | Color |
|---|---|---|---|---|---|
| Nav links | Bebas Neue | `clamp(3rem, 7vw, 7rem)` | 4px | uppercase | `#ffffff` |
| Wordmark ("boroma studios") | JetBrains Mono | 10px | 3px | uppercase | `rgba(255,255,255,0.45)` |
| Close button | JetBrains Mono | 10px | 3px | uppercase | `rgba(255,255,255,0.45)` |
| Social abbreviations | JetBrains Mono | 9px | 2px | uppercase | `rgba(255,255,255,0.35)` |
| Interior page headings | JetBrains Mono | 11px | widest | uppercase | `rgba(255,255,255,0.6)` |

CSS custom properties defined via `next/font`:
- `--font-jetbrains-mono` → Tailwind class `font-mono`
- `--font-bebas-neue` → Tailwind class `font-display`

### Color Palette

- Background: video VHS footage (`hero.mp4`) on landing; `bg-black` on interior pages
- Video overlay: `bg-black/50`
- Nav overlay background (open): `bg-black/80` (slight transparency lets video bleed through on landing)
- Primary text: `#ffffff`
- Subdued text: `rgba(255,255,255,0.45)`

### Hover & Active States (nav links)

- **Default:** `opacity-100`
- **Hover:** `opacity-40`, transition `duration-150 ease-out`
- **Active route:** `opacity-40` + `line-through`

---

## 5. Tailwind Configuration

```ts
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      display: ['var(--font-bebas-neue)', 'sans-serif'],
    },
  },
}
```

No custom colors or spacing needed. All values are Tailwind defaults.

---

## 6. Interior Page Shells

Each page mounts `NavigationOverlay` with `defaultOpen={false}` (wordmark trigger in corner). Content renders below at normal flow:

```tsx
export default function PageName() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 text-[11px] uppercase tracking-widest text-white/60">page-name</h1>
        {/* content scaffold */}
      </div>
    </>
  )
}
```

`/about` additionally renders: `<p className="text-[10px] uppercase tracking-widest text-white/40">Minneapolis / Saint Paul</p>`
`/contact` renders: scope textarea + budget tier select + submit button (UI only)
`/portal` renders: email input + password input + submit button (UI only)

---

## 7. Metadata

```ts
export const metadata: Metadata = {
  title: 'Boroma Studios',
  description: 'Multidisciplinary creative and engineering studio. Minneapolis / Saint Paul.',
}
```

---

## 8. Out of Scope (This Pass)

- Contact form backend / email routing
- Portal authentication
- Social icon real URLs (placeholders only)
- SEO / OG image
- Interior page real content (all shells)
- Nav open/close animation (plain toggle, no transition)

---

## 9. File Naming Note

Rename `afrobeat party vhs 6.22.24.mp4` → `hero.mp4` in `public/` at project setup. Avoids URL-encoding issues across all environments.
