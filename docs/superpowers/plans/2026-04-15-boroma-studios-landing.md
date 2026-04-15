# Boroma Studios Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Boroma Studios landing page — a full-viewport VHS video hero with a toggleable full-screen centered bold navigation overlay — on Next.js App Router with 7 interior page shells.

**Architecture:** `HeroBackground` (fixed video + overlay, landing page only) and `NavigationOverlay` (`'use client'`, full-screen centered Bebas Neue nav with toggle state) are two focused components. Each page mounts `NavigationOverlay` directly with a `defaultOpen` prop — `true` on the landing page, `false` on interior pages. The root layout handles fonts and metadata only.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS v3, TypeScript, JetBrains Mono + Bebas Neue (next/font/google), Jest + React Testing Library

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/components/HeroBackground.tsx` | Fixed full-viewport video + dark overlay |
| Create | `src/components/NavigationOverlay.tsx` | Full-screen centered bold nav, open/close toggle |
| Create | `src/app/layout.tsx` | Root: fonts, metadata only |
| Create | `src/app/page.tsx` | Landing page: HeroBackground + NavigationOverlay defaultOpen |
| Create | `src/app/software/page.tsx` | Shell |
| Create | `src/app/media/page.tsx` | Shell |
| Create | `src/app/capabilities/page.tsx` | Shell |
| Create | `src/app/archive/page.tsx` | Shell |
| Create | `src/app/about/page.tsx` | Shell with location line |
| Create | `src/app/contact/page.tsx` | Shell with form scaffold |
| Create | `src/app/portal/page.tsx` | Shell with login scaffold |
| Modify | `tailwind.config.ts` | Add `font-mono` + `font-display` (Bebas Neue) |
| Create | `jest.config.ts` | Jest + next/jest + jsdom |
| Create | `jest.setup.ts` | jest-dom + next/navigation mock |
| Create | `src/components/__tests__/HeroBackground.test.tsx` | Component tests |
| Create | `src/components/__tests__/NavigationOverlay.test.tsx` | Component tests |
| Copy | `public/hero.mp4` | Video asset renamed from original |

---

## Task 1: Scaffold Next.js Project

**Files:** project root (scaffolded by CLI)

- [ ] **Step 1: Run create-next-app**

```bash
cd "C:/Users/brahi/Desktop/CDNMKND2/NEW BOROMA"
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

Accept all defaults when prompted.

- [ ] **Step 2: Verify scaffold**

```bash
ls src/app
```

Expected output includes: `layout.tsx  page.tsx  globals.css`

- [ ] **Step 3: Copy and rename video asset**

```bash
cp "afrobeat party vhs 6.22.24.mp4" public/hero.mp4
ls -lh public/hero.mp4
```

Expected: file exists with a size matching the original.

- [ ] **Step 4: Clear default page to a build-safe placeholder**

Replace `src/app/page.tsx`:

```tsx
// src/app/page.tsx
export default function Home() {
  return <main />
}
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000` — expect blank black page, no terminal errors. Stop with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind + TypeScript"
```

---

## Task 2: Configure Fonts and Tailwind

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--font-bebas-neue)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Strip globals.css to bare essentials**

Replace `src/app/globals.css`:

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
```

- [ ] **Step 3: Replace root layout with font loading**

Replace `src/app/layout.tsx`:

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { JetBrains_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jetbrains-mono',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
})

export const metadata: Metadata = {
  title: 'Boroma Studios',
  description: 'Multidisciplinary creative and engineering studio. Minneapolis / Saint Paul.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} ${bebasNeue.variable} bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify fonts load**

```bash
npm run dev
```

Open `http://localhost:3000`. In DevTools → Elements, inspect `<body>`. Should have both `--font-jetbrains-mono` and `--font-bebas-neue` CSS variables in Computed styles. Stop server.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts src/app/layout.tsx src/app/globals.css
git commit -m "feat: configure JetBrains Mono and Bebas Neue fonts with Tailwind"
```

---

## Task 3: Set Up Testing

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install testing dependencies**

```bash
npm install --save-dev \
  jest \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @types/jest \
  ts-jest
```

- [ ] **Step 2: Create jest.config.ts**

```ts
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 3: Create jest.setup.ts**

```ts
// jest.setup.ts
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))
```

- [ ] **Step 4: Add test scripts to package.json**

In the `"scripts"` block of `package.json`, add:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 5: Verify Jest runs with no failures**

```bash
npm test -- --passWithNoTests
```

Expected: exits 0 with `Test Suites: 0 passed` or similar.

- [ ] **Step 6: Commit**

```bash
git add jest.config.ts jest.setup.ts package.json package-lock.json
git commit -m "feat: add Jest + React Testing Library setup"
```

---

## Task 4: Build HeroBackground Component (TDD)

**Files:**
- Create: `src/components/__tests__/HeroBackground.test.tsx`
- Create: `src/components/HeroBackground.tsx`

- [ ] **Step 1: Create the test directory**

```bash
mkdir -p src/components/__tests__
```

- [ ] **Step 2: Write the failing tests**

```tsx
// src/components/__tests__/HeroBackground.test.tsx
import { render, screen } from '@testing-library/react'
import HeroBackground from '../HeroBackground'

describe('HeroBackground', () => {
  it('renders a video element with correct src', () => {
    render(<HeroBackground src="/hero.mp4" />)
    const video = screen.getByTestId('hero-video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/hero.mp4')
  })

  it('sets loop and playsInline on the video', () => {
    render(<HeroBackground src="/hero.mp4" />)
    const video = screen.getByTestId('hero-video')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
  })

  it('renders the dark overlay', () => {
    render(<HeroBackground src="/hero.mp4" />)
    expect(screen.getByTestId('hero-overlay')).toBeInTheDocument()
  })

  it('renders optional poster attribute when provided', () => {
    render(<HeroBackground src="/hero.mp4" poster="/poster.jpg" />)
    const video = screen.getByTestId('hero-video')
    expect(video).toHaveAttribute('poster', '/poster.jpg')
  })
})
```

- [ ] **Step 3: Run tests — verify they fail**

```bash
npm test -- --testPathPattern=HeroBackground
```

Expected: FAIL — `Cannot find module '../HeroBackground'`

- [ ] **Step 4: Create the component**

```tsx
// src/components/HeroBackground.tsx
type HeroBackgroundProps = {
  src: string
  poster?: string
}

export default function HeroBackground({ src, poster }: HeroBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0">
      <video
        data-testid="hero-video"
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        data-testid="hero-overlay"
        className="absolute inset-0 bg-black/50"
      />
    </div>
  )
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npm test -- --testPathPattern=HeroBackground
```

Expected: PASS — 4 tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroBackground.tsx src/components/__tests__/HeroBackground.test.tsx
git commit -m "feat: add HeroBackground component"
```

---

## Task 5: Build NavigationOverlay Component (TDD)

**Files:**
- Create: `src/components/__tests__/NavigationOverlay.test.tsx`
- Create: `src/components/NavigationOverlay.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/__tests__/NavigationOverlay.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import NavigationOverlay from '../NavigationOverlay'

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

const testLinks = [
  { label: 'software', href: '/software' },
  { label: 'media', href: '/media' },
  { label: 'about', href: '/about' },
]

describe('NavigationOverlay', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  it('renders the wordmark in all states', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByText('boroma studios')).toBeInTheDocument()
  })

  it('shows nav links when defaultOpen is true', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByRole('link', { name: /software/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /media/i })).toBeInTheDocument()
  })

  it('hides nav links when defaultOpen is false', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={false} />)
    expect(screen.queryByRole('link', { name: /software/i })).not.toBeInTheDocument()
  })

  it('shows nav links after clicking the wordmark trigger when closed', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={false} />)
    fireEvent.click(screen.getByText('boroma studios'))
    expect(screen.getByRole('link', { name: /software/i })).toBeInTheDocument()
  })

  it('hides nav links after clicking close button', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    fireEvent.click(screen.getByText('close'))
    expect(screen.queryByRole('link', { name: /software/i })).not.toBeInTheDocument()
  })

  it('renders nav links with correct hrefs', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByRole('link', { name: /software/i })).toHaveAttribute('href', '/software')
  })

  it('applies active styles to the current route link', () => {
    mockUsePathname.mockReturnValue('/software')
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    const activeLink = screen.getByRole('link', { name: /software/i })
    expect(activeLink).toHaveClass('line-through')
  })

  it('does not apply active styles to non-current route links', () => {
    mockUsePathname.mockReturnValue('/software')
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByRole('link', { name: /media/i })).not.toHaveClass('line-through')
  })

  it('renders social icons container when open', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByTestId('social-icons')).toBeInTheDocument()
  })

  it('social icons container has hidden md:flex classes', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    const socials = screen.getByTestId('social-icons')
    expect(socials).toHaveClass('hidden')
    expect(socials).toHaveClass('md:flex')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- --testPathPattern=NavigationOverlay
```

Expected: FAIL — `Cannot find module '../NavigationOverlay'`

- [ ] **Step 3: Create the component**

```tsx
// src/components/NavigationOverlay.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

type NavLink = { label: string; href: string }

type NavigationOverlayProps = {
  links: NavLink[]
  defaultOpen?: boolean
}

const socialIcons = [
  { label: 'IG', href: '#' },
  { label: 'YT', href: '#' },
  { label: 'FB', href: '#' },
  { label: 'SP', href: '#' },
  { label: 'AS', href: '#' },
  { label: 'WC', href: '#' },
  { label: 'WB', href: '#' },
]

export default function NavigationOverlay({ links, defaultOpen = false }: NavigationOverlayProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const pathname = usePathname()

  return (
    <>
      {/* Wordmark — always visible, acts as trigger when closed */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-7 left-7 z-30 font-mono text-[10px] uppercase tracking-[3px] text-white/45 cursor-pointer bg-transparent border-none p-0"
      >
        boroma studios
      </button>

      {/* Full-screen overlay — only when open */}
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/80 flex flex-col items-center justify-center">

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-7 right-7 font-mono text-[10px] uppercase tracking-[3px] text-white/45 cursor-pointer bg-transparent border-none p-0 hover:text-white/80 transition-colors duration-150"
          >
            close
          </button>

          {/* Nav links */}
          <nav className="flex flex-col items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={[
                    'font-display text-white uppercase tracking-[4px] leading-none transition-opacity duration-150 hover:opacity-40',
                    'text-[clamp(2.5rem,7vw,6rem)]',
                    isActive ? 'opacity-40 line-through' : 'opacity-100',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Social icons — desktop only */}
          <div
            data-testid="social-icons"
            className="hidden md:flex fixed bottom-7 left-7 gap-3"
          >
            {socialIcons.map((icon) => (
              <a
                key={icon.label}
                href={icon.href}
                className="font-mono text-[9px] uppercase tracking-[2px] text-white/35 hover:text-white/80 transition-colors duration-150"
              >
                {icon.label}
              </a>
            ))}
          </div>

        </div>
      )}
    </>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- --testPathPattern=NavigationOverlay
```

Expected: PASS — 10 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/NavigationOverlay.tsx src/components/__tests__/NavigationOverlay.test.tsx
git commit -m "feat: add NavigationOverlay with centered bold display type and toggle state"
```

---

## Task 6: Wire Landing Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Define navLinks constant in a shared location**

Create `src/lib/nav.ts`:

```ts
// src/lib/nav.ts
export type NavLink = { label: string; href: string }

export const navLinks: NavLink[] = [
  { label: 'software', href: '/software' },
  { label: 'media', href: '/media' },
  { label: 'capabilities', href: '/capabilities' },
  { label: 'archive', href: '/archive' },
  { label: 'about', href: '/about' },
  { label: 'contact', href: '/contact' },
  { label: 'portal', href: '/portal' },
]
```

- [ ] **Step 2: Write the landing page**

Replace `src/app/page.tsx`:

```tsx
// src/app/page.tsx
import HeroBackground from '@/components/HeroBackground'
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <HeroBackground src="/hero.mp4" />
      <NavigationOverlay links={navLinks} defaultOpen={true} />
    </main>
  )
}
```

- [ ] **Step 3: Run dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- VHS video fills the entire viewport
- Dark overlay dims the video
- Centered full-screen nav links render in large Bebas Neue bold caps
- "boroma studios" wordmark is top-left in small monospace
- "close" button is top-right in small monospace
- Click "close" — nav disappears, wordmark remains
- Click wordmark — nav reappears
- Social icons visible bottom-left at desktop width

Stop server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/lib/nav.ts
git commit -m "feat: wire landing page with HeroBackground and NavigationOverlay"
```

---

## Task 7: Build Interior Page Shells

**Files:**
- Create: `src/app/software/page.tsx`
- Create: `src/app/media/page.tsx`
- Create: `src/app/capabilities/page.tsx`
- Create: `src/app/archive/page.tsx`
- Create: `src/app/about/page.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/portal/page.tsx`

- [ ] **Step 1: Create software shell**

```bash
mkdir -p src/app/software
```

```tsx
// src/app/software/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function SoftwarePage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">software</h1>
        <p className="font-mono text-[11px] text-white/30 tracking-wider">
          Engineering logic and deployed products — coming soon.
        </p>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Create media shell**

```bash
mkdir -p src/app/media
```

```tsx
// src/app/media/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function MediaPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">media</h1>
        <p className="font-mono text-[11px] text-white/30 tracking-wider">
          Visual and auditory proof of work — coming soon.
        </p>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Create capabilities shell**

```bash
mkdir -p src/app/capabilities
```

```tsx
// src/app/capabilities/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function CapabilitiesPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">capabilities</h1>
        <p className="font-mono text-[11px] text-white/30 tracking-wider">
          Technical and creative service index — coming soon.
        </p>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Create archive shell**

```bash
mkdir -p src/app/archive
```

```tsx
// src/app/archive/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function ArchivePage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">archive</h1>
        <p className="font-mono text-[11px] text-white/30 tracking-wider">
          Chronological project record — coming soon.
        </p>
      </div>
    </>
  )
}
```

- [ ] **Step 5: Create about shell**

```bash
mkdir -p src/app/about
```

```tsx
// src/app/about/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function AboutPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">about</h1>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/40">
          Minneapolis / Saint Paul
        </p>
        <p className="font-mono text-[11px] text-white/30 tracking-wider">
          Multidisciplinary creative and engineering studio — manifesto coming soon.
        </p>
      </div>
    </>
  )
}
```

- [ ] **Step 6: Create contact shell**

```bash
mkdir -p src/app/contact
```

```tsx
// src/app/contact/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function ContactPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">contact</h1>
        <form className="flex flex-col gap-6 max-w-md">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Project Scope
            </label>
            <textarea
              className="bg-transparent border border-white/20 font-mono text-white text-xs tracking-wider p-3 resize-none h-24 outline-none focus:border-white/50 transition-colors"
              placeholder="Describe your project..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Budget Tier
            </label>
            <select className="bg-black border border-white/20 font-mono text-white text-xs tracking-wider p-3 outline-none focus:border-white/50 transition-colors appearance-none">
              <option value="">Select a tier</option>
              <option value="under-5k">Under $5,000</option>
              <option value="5k-15k">$5,000 – $15,000</option>
              <option value="15k-50k">$15,000 – $50,000</option>
              <option value="50k-plus">$50,000+</option>
            </select>
          </div>
          <button
            type="submit"
            className="self-start border border-white/30 font-mono text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:border-white/70 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  )
}
```

- [ ] **Step 7: Create portal shell**

```bash
mkdir -p src/app/portal
```

```tsx
// src/app/portal/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function PortalPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">portal</h1>
        <form className="flex flex-col gap-6 max-w-xs">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Email
            </label>
            <input
              type="email"
              className="bg-transparent border border-white/20 font-mono text-white text-xs tracking-wider p-3 outline-none focus:border-white/50 transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Password
            </label>
            <input
              type="password"
              className="bg-transparent border border-white/20 font-mono text-white text-xs tracking-wider p-3 outline-none focus:border-white/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="self-start border border-white/30 font-mono text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:border-white/70 transition-colors"
          >
            Access Portal
          </button>
        </form>
      </div>
    </>
  )
}
```

- [ ] **Step 8: Verify all routes in dev server**

```bash
npm run dev
```

Visit each route and confirm:
- `http://localhost:3000/software` — title renders, wordmark visible top-left
- `http://localhost:3000/media` — same
- `http://localhost:3000/capabilities` — same
- `http://localhost:3000/archive` — same
- `http://localhost:3000/about` — "Minneapolis / Saint Paul" line visible
- `http://localhost:3000/contact` — form fields render
- `http://localhost:3000/portal` — login fields render

On each page: click wordmark → centered nav opens with correct active route strikethrough → click "close" or a link → nav closes. Stop server.

- [ ] **Step 9: Commit**

```bash
git add src/app/software src/app/media src/app/capabilities src/app/archive src/app/about src/app/contact src/app/portal
git commit -m "feat: add 7 interior page shells with NavigationOverlay toggle"
```

---

## Task 8: Full Test Suite and Build Verification

**Files:** No new files.

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass.
- `HeroBackground.test.tsx` — 4 passing
- `NavigationOverlay.test.tsx` — 10 passing

If any test fails, fix the component before proceeding.

- [ ] **Step 2: TypeScript type check**

```bash
npx tsc --noEmit
```

Expected: No errors. Fix any type errors before continuing.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected: Build completes successfully. All 8 routes appear:

```
Route (app)
├ ○ /
├ ○ /about
├ ○ /archive
├ ○ /capabilities
├ ○ /contact
├ ○ /media
├ ○ /portal
└ ○ /software
```

- [ ] **Step 4: Verify production build locally**

```bash
npm run start
```

Open `http://localhost:3000`. Final verification:
- Video hero playing, overlay dimming it
- Centered bold nav visible (SOFTWARE, MEDIA, etc. in Bebas Neue)
- "close" dismisses nav, wordmark click reopens it
- Navigate to `/about` via nav — active route has strikethrough
- Social icons visible bottom-left at desktop width, hidden when viewport < 768px

Stop server.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Boroma Studios landing page — build verified"
```

---

## Out of Scope (Not in This Plan)

- Contact form backend / email routing
- Portal authentication
- Social icon real URLs
- SEO / OG image
- Interior page real content
- Nav open/close transition animations
