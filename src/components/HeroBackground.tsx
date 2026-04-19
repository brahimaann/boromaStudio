'use client'

// src/components/HeroBackground.tsx
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

    // Force play — required by mobile browsers (iOS Safari, Instagram in-app)
    // that ignore the autoPlay HTML attribute.
    video.muted = true
    video.play().catch(() => {
      // Autoplay still blocked (e.g. low-power mode) — silently fail,
      // the poster frame will show instead.
    })
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <video
        ref={videoRef}
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
