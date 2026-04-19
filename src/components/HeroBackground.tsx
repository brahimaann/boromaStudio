'use client'

// src/components/HeroBackground.tsx
// NOTE: video.muted must be set via JS ref — React does not correctly reflect
// the `muted` prop to the DOM attribute, which causes iOS Safari to block autoplay.

import { useEffect, useRef } from 'react'

type HeroBackgroundProps = {
  src: string
  poster?: string
}

export default function HeroBackground({ src, poster }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <video
        // Inline ref sets muted=true immediately on element creation,
        // before the browser runs its autoplay eligibility check.
        ref={(el) => {
          (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el
          if (el) el.muted = true
        }}
        data-testid="hero-video"
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div
        data-testid="hero-overlay"
        className="absolute inset-0 bg-black/15"
      />
    </div>
  )
}
