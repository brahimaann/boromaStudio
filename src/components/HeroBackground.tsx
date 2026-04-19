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

    // Force the browser to start fetching the video, then play.
    // Without load(), iOS Safari never downloads anything and canplay never fires.
    video.load()
    video.play().then(() => {
      setBlocked(false)
    }).catch(() => {
      // play() failed before video loaded — wait for it to buffer then retry
      const onCanPlay = () => {
        video.play().then(() => setBlocked(false)).catch(() => setBlocked(true))
      }
      video.addEventListener('canplay', onCanPlay, { once: true })
    })
  }, [])

  const handleTap = () => {
    videoRef.current?.play().then(() => setBlocked(false)).catch(() => {})
  }

  return (
    <div className="fixed inset-0 z-0" onClick={blocked ? handleTap : undefined}>
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

      {/* Tap-to-play — only shown when autoplay is blocked */}
      {blocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleTap}
            aria-label="Play video"
            className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-opacity duration-300"
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
