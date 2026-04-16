'use client'

// src/app/work/page.tsx
import { useState } from 'react'
import Image from 'next/image'
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

// ─── Sessions ────────────────────────────────────────────────────────────────

const sessions = [
  {
    id: 'mo-2x',
    label: 'Mo 2x',
    date: '07.20.25',
    photos: [
      'mo 2x  7.20.25-42.jpg',
      'mo 2x  7.20.25-43.jpg',
      'mo 2x  7.20.25-46.jpg',
      'mo 2x  7.20.25-59.jpg',
      'mo 2x  7.20.25-60.jpg',
      'mo 2x  7.20.25-63.jpg',
      'mo 2x  7.20.25-86.jpg',
      'mo 2x  7.20.25-99.jpg',
      'mo 2x  7.20.25-103.jpg',
      'mo 2x  7.20.25-104.jpg',
      'mo 2x  7.20.25-106.jpg',
      'mo 2x  7.20.25-116.jpg',
    ],
  },
  {
    id: 'mini',
    label: 'Mini',
    date: '07.09.25',
    photos: [
      'mini 7.9.25-76.jpg',
      'mini 7.9.25-84.jpg',
      'mini 7.9.25-86.jpg',
      'mini 7.9.25-94.jpg',
    ],
  },
  {
    id: 'ash-rv',
    label: 'Ash — RV',
    date: '08.29.25',
    photos: [
      'ASH RV 8.29.25 (3 of 83).jpg',
      'ASH RV 8.29.25 (14 of 83).jpg',
      'ASH RV 8.29.25 (22 of 83).jpg',
      'ASH RV 8.29.25 (43 of 83).jpg',
      'ASH RV 8.29.25 (76 of 83).jpg',
    ],
  },
  {
    id: 'ash-atl',
    label: 'Ash — Atlanta',
    date: '06.21.25',
    photos: [
      'ASH ATL 6.21.25-37.jpg',
      'ASH ATL 6.21.25-49.jpg',
      'ASH ATL 6.21.25-50.jpg',
      'ASH ATL 6.21.25-51.jpg',
      'ASH ATL 6.21.25-54.jpg',
    ],
  },
  {
    id: 'dec-2025',
    label: 'December',
    date: '12.12.25',
    photos: [
      '20251212-_MG_1064.jpg',
      '20251212-_MG_1095.jpg',
      '20251212-_MG_1098.jpg',
      '20251212-_MG_1101.jpg',
      '20251212-_MG_1105.jpg',
      '20251212-_MG_1116.jpg',
      '20251212-_MG_1256.jpg',
      '20251212-_MG_1268.jpg',
      '20251212-_MG_1281.jpg',
      '20251212-_MG_1319.jpg',
    ],
  },
  {
    id: 'moni',
    label: 'Moni',
    date: '10.2022',
    photos: [
      'MONI10-22-4.jpg',
      'MONI10-22-6.jpg',
      'MONI10-22-52.jpg',
      'MONI10-22-79.jpg',
    ],
  },
  {
    id: 'misc',
    label: 'Archive',
    date: '—',
    photos: [
      '_MG_9533.JPG',
      '_MG_0740.jpg',
      '_MG_2243.jpg',
      '_MG_2253.jpg',
    ],
  },
]

const ALL = 'all'

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkPage() {
  const [active, setActive] = useState(ALL)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const visible = active === ALL
    ? sessions
    : sessions.filter((s) => s.id === active)

  const totalCount = sessions.reduce((n, s) => n + s.photos.length, 0)

  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />

      <div className="min-h-screen bg-black text-white">

        {/* ── Header ────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-sm border-b border-white/8 px-6 pt-7 pb-4 pl-28 md:pl-40 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[3px] text-white/30 mb-1">
              photography
            </p>
            <p className="font-mono text-[9px] text-white/20 tracking-wider">
              {totalCount} frames
            </p>
          </div>

          {/* Session filter */}
          <nav className="flex items-center gap-1 flex-wrap justify-end">
            <button
              onClick={() => setActive(ALL)}
              className={[
                'font-mono text-[9px] uppercase tracking-[2px] px-2 py-1 border transition-colors duration-150',
                active === ALL
                  ? 'border-white/40 text-white/80'
                  : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/25',
              ].join(' ')}
            >
              all
            </button>
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={[
                  'font-mono text-[9px] uppercase tracking-[2px] px-2 py-1 border transition-colors duration-150',
                  active === s.id
                    ? 'border-white/40 text-white/80'
                    : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/25',
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </header>

        {/* ── Gallery ───────────────────────────────────── */}
        <main className="px-1 pt-1 pb-16">
          {visible.map((session) => (
            <section key={session.id} className="mb-1">

              {/* Session label */}
              <div className="flex items-center gap-4 px-3 py-3">
                <span className="font-mono text-[9px] uppercase tracking-[3px] text-white/25">
                  {session.label}
                </span>
                <span className="font-mono text-[9px] text-white/15">
                  {session.date}
                </span>
                <span className="font-mono text-[9px] text-white/10">
                  {session.photos.length}
                </span>
              </div>

              {/* Masonry columns */}
              <div
                style={{
                  columns: 'var(--gallery-cols)',
                  columnGap: '2px',
                }}
                className="[--gallery-cols:2] md:[--gallery-cols:3] lg:[--gallery-cols:4]"
              >
                {session.photos.map((file) => {
                  const src = `/works/${encodeURIComponent(file)}`
                  const isLandscape = file === '_MG_9533.JPG'
                  return (
                    <div
                      key={file}
                      className="break-inside-avoid mb-[2px] cursor-pointer group relative overflow-hidden"
                      onClick={() => setLightbox(src)}
                    >
                      <Image
                        src={src}
                        alt={file.replace(/\.[^.]+$/, '')}
                        width={isLandscape ? 1333 : 750}
                        height={isLandscape ? 1000 : 1000}
                        className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-85"
                        loading="lazy"
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </main>
      </div>

      {/* ── Lightbox ──────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="fixed top-6 right-7 font-mono text-[9px] uppercase tracking-[3px] text-white/40 hover:text-white/80 transition-colors duration-150 z-50"
          >
            close
          </button>
          <div
            className="relative max-h-screen max-w-screen-lg w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt="Lightbox"
              width={1500}
              height={2000}
              className="max-h-screen w-auto mx-auto object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
