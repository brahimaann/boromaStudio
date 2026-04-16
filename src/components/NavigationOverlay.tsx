// src/components/NavigationOverlay.tsx
'use client'

import { useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

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
  const router = useRouter()
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isLight = pathname.startsWith('/software')

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
                className={[
                  'font-mono text-[9px] uppercase tracking-[2px] transition-colors duration-150',
                  isLight
                    ? 'text-black/35 hover:text-black/80'
                    : 'text-white/35 hover:text-white/80',
                ].join(' ')}
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
