'use client'

// src/components/HeroBackground.tsx
// We inject the <video> as raw HTML to bypass React's known bug where the
// `muted` prop is never written to the DOM attribute — which causes iOS Safari
// to block autoplay. dangerouslySetInnerHTML guarantees the browser sees
// <video autoplay muted loop playsinline> exactly as written.

type HeroBackgroundProps = {
  src: string
  poster?: string
}

export default function HeroBackground({ src, poster }: HeroBackgroundProps) {
  const posterAttr = poster ? `poster="${poster}"` : ''

  return (
    <div className="fixed inset-0 z-0">
      <div
        data-testid="hero-video-wrapper"
        className="absolute inset-0"
        dangerouslySetInnerHTML={{
          __html: `
            <video
              autoplay
              muted
              loop
              playsinline
              preload="auto"
              ${posterAttr}
              style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
            >
              <source src="${src}" type="video/mp4" />
            </video>
          `,
        }}
      />
      <div
        data-testid="hero-overlay"
        className="absolute inset-0 bg-black/15"
      />
    </div>
  )
}
