// src/components/NavigationOverlay.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useHyperspace } from './HyperspaceTransition'

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
  const { navigate } = useHyperspace()

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
                <button
                  key={link.href}
                  onClick={(e) => {
                    setIsOpen(false)
                    navigate(link.href, e.currentTarget)
                  }}
                  className={[
                    'font-display text-white uppercase tracking-[4px] leading-none transition-opacity duration-150 hover:opacity-40 bg-transparent border-none p-0 cursor-pointer',
                    'text-[clamp(2.5rem,7vw,6rem)]',
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
