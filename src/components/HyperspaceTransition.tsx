'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import gsap from 'gsap'

// ─── Context ──────────────────────────────────────────────────────────────────

type HyperspaceContextType = {
  navigate: (href: string, element: HTMLElement) => void
}

const HyperspaceContext = createContext<HyperspaceContextType>({
  navigate: (href) => { window.location.href = href },
})

export function useHyperspace() {
  return useContext(HyperspaceContext)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HyperspaceTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)
  const overlayRef = useRef<HTMLDivElement>(null)
  const streaksRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isNavigatingRef = useRef(false)

  // ── Reveal new page when route change completes ────────────────────────────
  useEffect(() => {
    if (pathname !== prevPathnameRef.current && isNavigatingRef.current) {
      prevPathnameRef.current = pathname
      isNavigatingRef.current = false

      const overlay = overlayRef.current
      const streaks = streaksRef.current
      const wrapper = wrapperRef.current

      if (!overlay) return

      // Reset zoom instantly (screen is white, reset is invisible)
      if (wrapper) gsap.set(wrapper, { scale: 1, clearProps: 'transformOrigin' })
      if (streaks) streaks.innerHTML = ''

      // Fade white out to reveal new page
      gsap.to(overlay, {
        opacity: 0,
        delay: 0.1,
        duration: 0.55,
        ease: 'power2.out',
        onComplete: () => {
          if (overlay) overlay.style.display = 'none'
        },
      })
    }
  }, [pathname])

  // ── Back-button recovery ───────────────────────────────────────────────────
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        const overlay = overlayRef.current
        const wrapper = wrapperRef.current
        const streaks = streaksRef.current
        if (wrapper) gsap.set(wrapper, { clearProps: 'all' })
        if (overlay) gsap.set(overlay, { opacity: 0, display: 'none' })
        if (streaks) streaks.innerHTML = ''
        isNavigatingRef.current = false
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  // ── Hyperspace animation ───────────────────────────────────────────────────
  const navigate = useCallback(
    (href: string, element: HTMLElement) => {
      if (isNavigatingRef.current) return

      const overlay = overlayRef.current
      const streaksContainer = streaksRef.current
      const wrapper = wrapperRef.current

      if (!overlay || !streaksContainer || !wrapper) {
        router.push(href)
        return
      }

      isNavigatingRef.current = true

      // Calculate origin from clicked element centre
      const rect = element.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      // Build radial streak burst (28 rays, random lengths, 1-2 px wide)
      streaksContainer.innerHTML = ''
      const NUM_STREAKS = 28
      const streakEls: HTMLDivElement[] = []

      for (let i = 0; i < NUM_STREAKS; i++) {
        const angle = (i / NUM_STREAKS) * 360
        const length = 160 + Math.random() * 420
        const width = Math.random() > 0.5 ? 2 : 1

        const el = document.createElement('div')
        Object.assign(el.style, {
          position: 'fixed',
          left: `${cx}px`,
          top: `${cy}px`,
          width: `${width}px`,
          height: `${length}px`,
          background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0) 100%)',
          transformOrigin: 'top center',
          transform: `rotate(${angle}deg) scaleY(0)`,
          willChange: 'transform',
          pointerEvents: 'none',
        })
        streaksContainer.appendChild(el)
        streakEls.push(el)
      }

      // Prep overlay and wrapper
      gsap.set(overlay, { display: 'block', opacity: 0 })
      gsap.set(wrapper, {
        transformOrigin: `${cx}px ${cy}px`,
        scale: 1,
        force3D: true,
      })

      const tl = gsap.timeline()

      // Phase 1 — subtle initial pull (rumble)
      tl.to(wrapper, {
        scale: 1.08,
        duration: 0.14,
        ease: 'power1.in',
        force3D: true,
      })

      // Phase 2 — streak burst from origin
      tl.to(
        streakEls,
        {
          scaleY: 1,
          duration: 0.28,
          ease: 'expo.in',
          stagger: { amount: 0.1, from: 'random' },
        },
        '-=0.06'
      )

      // Phase 3 — exponential zoom to hyperspace
      tl.to(
        wrapper,
        {
          scale: 85,
          duration: 0.48,
          ease: 'expo.in',
          force3D: true,
        },
        '-=0.22'
      )

      // Phase 4 — white flash covers everything
      tl.to(
        overlay,
        {
          opacity: 1,
          duration: 0.14,
          ease: 'power4.in',
          onComplete: () => {
            // Navigate while screen is fully white
            router.push(href)
          },
        },
        '-=0.1'
      )
    },
    [router]
  )

  return (
    <HyperspaceContext.Provider value={{ navigate }}>
      {/* White flash — fixed to viewport, outside the zoom wrapper */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#ffffff',
          zIndex: 99999,
          display: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Streak container — fixed to viewport, outside the zoom wrapper */}
      <div
        ref={streaksRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      />

      {/* Page content wrapper — this is what gets zoomed */}
      <div ref={wrapperRef} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </HyperspaceContext.Provider>
  )
}
