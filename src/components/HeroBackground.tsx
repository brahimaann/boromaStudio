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

    // iOS Safari requires muted to be set via JS, not just as an attribute
    video.muted = true
    video.playsInline = true

    const attemptPlay = () => {
      video.play().catch(() => {
        // Still blocked (e.g. low-power mode) — poster frame shows instead
      })
    }

    // If already have enough data, play immediately.
    // Otherwise wait for canplay — iOS Safari often hasn't buffered yet on mount.
    if (video.readyState >= 3) {
      attemptPlay()
    } else {
      video.addEventListener('canplay', attemptPlay, { once: true })
    }

    return () => {
      video.removeEventListener('canplay', attemptPlay)
    }
  }, [])

  // Append Cloudinary transformation to ensure H.264 + web-optimised delivery
  const optimisedSrc = src.replace(
    '/video/upload/',
    '/video/upload/vc_h264,q_auto,f_mp4/'
  )

  return (
    <div className="fixed inset-0 z-0">
      <video
        ref={videoRef}
        data-testid="hero-video"
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={optimisedSrc} type="video/mp4" />
      </video>
      <div
        data-testid="hero-overlay"
        className="absolute inset-0 bg-black/15"
      />
    </div>
  )
}
