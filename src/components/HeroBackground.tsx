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
