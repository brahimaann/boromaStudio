'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function PendulumLoader({ children }: { children: React.ReactNode }) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const armRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const loader = loaderRef.current
    const arm = armRef.current
    const content = contentRef.current
    if (!loader || !arm || !content) return

    // Set initial states
    gsap.set(arm, { rotation: -45 })
    gsap.set(content, { opacity: 0 })

    let pageLoaded = false

    // 16-bit pendulum: steps(12) simulates low-fidelity frame increments
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      onRepeat: () => {
        if (pageLoaded) terminateLoader()
      },
    })

    tl.to(arm, {
      rotation: 45,
      duration: 1.5,
      ease: 'steps(12)',
    })

    tlRef.current = tl

    function terminateLoader() {
      tl.pause()

      // Final swing to neutral — 4 steps for crisp 16-bit settle
      gsap.to(arm, {
        rotation: 0,
        duration: 0.5,
        ease: 'steps(4)',
        onComplete: () => {
          const exitTl = gsap.timeline()
          exitTl
            .to(loader, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete: () => {
                if (loader) loader.style.display = 'none'
              },
            })
            .to(
              content,
              {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.inOut',
              },
              '-=0.4'
            )
        },
      })
    }

    // Trigger on window load — or immediately if already loaded
    if (document.readyState === 'complete') {
      pageLoaded = true
    } else {
      const onLoad = () => {
        pageLoaded = true
      }
      window.addEventListener('load', onLoad)
      return () => {
        window.removeEventListener('load', onLoad)
        tl.kill()
      }
    }

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <>
      {/* Loader overlay */}
      <div
        ref={loaderRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        {/* Uniform white dot grid — 16-bit pixel aesthetic */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.15,
          }}
        />

        {/* Pendulum */}
        <div
          style={{
            position: 'relative',
            width: '4px',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Pivot point */}
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#fff',
              imageRendering: 'pixelated',
              flexShrink: 0,
            }}
          />

          {/* Arm + bob */}
          <div
            ref={armRef}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: '4px',
              height: '150px',
              background: '#fff',
              transformOrigin: 'top center',
              imageRendering: 'pixelated',
              marginLeft: '-2px',
            }}
          >
            {/* Bob — 16x16 pixel square */}
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                background: '#fff',
                imageRendering: 'pixelated',
              }}
            />
          </div>
        </div>
      </div>

      {/* Page content — fades in after loader exits */}
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  )
}
