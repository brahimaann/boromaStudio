// src/components/NavigationOverlay.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type NavLink = { label: string; href: string }

type NavigationOverlayProps = {
  links: NavLink[]
  defaultOpen?: boolean
}

const socialIcons = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bo.roma/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@Bremmydontstop',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/artist/1EaHxnAbafKX8pu6okZf8p',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 11.973C8 9.539 9.79 8 12.004 8c1.672 0 2.905.943 3.508 1.887l-1.372.935C13.77 10.18 13.04 9.7 12.004 9.7c-1.295 0-2.27.978-2.27 2.273v.046c0 1.316.946 2.296 2.27 2.296 1.006 0 1.77-.5 2.174-1.135l1.38.912C14.908 15.045 13.67 16 12.004 16 9.772 16 8 14.452 8 12.019v-.046z" />
      </svg>
    ),
  },
]

export default function NavigationOverlay({ links, defaultOpen = false }: NavigationOverlayProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const pathname = usePathname()
  const router = useRouter()
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isLight = pathname.startsWith('/software')
  const isHero = pathname === '/'

  // ── Hero triggers: click / space / enter / b open the nav ────────────────
  useEffect(() => {
    if (!isHero || isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if ([' ', 'Enter', 'b', 'B'].includes(e.key)) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    const handleClick = (e: MouseEvent) => {
      // Skip the wordmark button — it has its own single/double-click logic
      if ((e.target as Element).closest('[data-wordmark]')) return
      setIsOpen(true)
    }

    window.addEventListener('keydown', handleKey)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('click', handleClick)
    }
  }, [isHero, isOpen])

  // Single click → open nav after 280ms (waits to see if double-click follows)
  // Double click → navigate home immediately, nav stays closed
  const handleWordmarkClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      router.push('/')
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null
        setIsOpen(true)
      }, 280)
    }
  }

  return (
    <>
      {/* Wordmark — single click opens nav, double click goes home */}
      <button
        data-wordmark
        onClick={handleWordmarkClick}
        className={[
          'fixed top-7 left-7 z-30 font-mono text-[10px] uppercase tracking-[3px] cursor-pointer bg-transparent border-none p-0 transition-colors duration-500',
          isLight ? 'text-black/50' : 'text-white/45',
        ].join(' ')}
      >
        boroma studios
      </button>

      {/* Full-screen overlay */}
      {isOpen && (
        <div
          className={[
            'fixed inset-0 z-20 flex flex-col items-center justify-center transition-colors duration-500',
            isLight ? 'bg-white/92' : 'bg-black/80',
          ].join(' ')}
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
            className={[
              'fixed top-7 right-7 font-mono text-[10px] uppercase tracking-[3px] cursor-pointer bg-transparent border-none p-0 transition-colors duration-150',
              isLight
                ? 'text-black/45 hover:text-black/80'
                : 'text-white/45 hover:text-white/80',
            ].join(' ')}
          >
            close
          </button>

          {/* Nav links — stopPropagation so backdrop click doesn't fire */}
          <nav
            className="flex flex-col items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <button
                  key={link.href}
                  onClick={() => {
                    setIsOpen(false)
                    router.push(link.href)
                  }}
                  className={[
                    'font-display uppercase tracking-[4px] leading-none transition-opacity duration-150 hover:opacity-40 bg-transparent border-none p-0 cursor-pointer',
                    'text-[clamp(2.5rem,7vw,6rem)]',
                    isLight ? 'text-black' : 'text-white',
                    isActive ? 'opacity-40 line-through' : 'opacity-100',
                  ].join(' ')}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* Social icons — desktop only */}
          <div
            data-testid="social-icons"
            className="hidden md:flex fixed bottom-7 left-7 gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {socialIcons.map((icon) => (
              <a
                key={icon.label}
                href={icon.href}
                aria-label={icon.label}
                className={[
                  'transition-colors duration-150',
                  isLight
                    ? 'text-black/35 hover:text-black/80'
                    : 'text-white/35 hover:text-white/80',
                ].join(' ')}
              >
                {icon.icon}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
