'use client'

// src/components/HeroBackground.tsx
import { useEffect, useRef, useState } from 'react'

type HeroBackgroundProps = {
  src: string
  poster?: string
}

export default function HeroBackground({ src, poster }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true

    const attemptPlay = () => {
      video.play().then(() => {
        setBlocked(false)
      }).catch(() => {
        // Autoplay blocked (in-app browser, low-power mode, etc.)
        setBlocked(true)
      })
    }

    if (video.readyState >= 3) {
      attemptPlay()
    } else {
      video.addEventListener('canplay', attemptPlay, { once: true })
    }

    return () => video.removeEventListener('canplay', attemptPlay)
  }, [])

  const handleTap = () => {
    const video = videoRef.current
    if (!video) return
    video.play().then(() => setBlocked(false)).catch(() => {})
  }

  // Force H.264 via Cloudinary transform for maximum Safari compatibility
  const optimisedSrc = src.replace(
    '/video/upload/',
    '/video/upload/vc_h264,q_auto,f_mp4/'
  )

  return (
    <div className="fixed inset-0 z-0" onClick={blocked ? handleTap : undefined}>
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

      {/* Tap-to-play — only shown when autoplay is blocked (e.g. Instagram browser) */}
      {blocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleTap}
            aria-label="Play video"
            className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm transition-opacity duration-300 hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1 opacity-80">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
