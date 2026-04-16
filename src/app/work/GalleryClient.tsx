'use client'

// src/app/work/GalleryClient.tsx

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Session, Photo } from '@/lib/gallery'

type LightboxState = { photos: Photo[]; index: number } | null

const LANDSCAPE_FILES = new Set(['_MG_9533.JPG'])

function dims(file: string) {
  return LANDSCAPE_FILES.has(file)
    ? { width: 1333, height: 1000 }
    : { width: 750, height: 1000 }
}

export default function GalleryClient({ sessions }: { sessions: Session[] }) {
  const [active, setActive] = useState('all')
  const [lb, setLb] = useState<LightboxState>(null)

  // ── Session filter ────────────────────────────────────────────────────────
  const visible = active === 'all'
    ? sessions
    : sessions.filter(s => s.id === active)

  const totalCount = sessions.reduce((n, s) => n + s.photos.length, 0)

  // ── Lightbox helpers ──────────────────────────────────────────────────────
  const openLightbox = useCallback((photos: Photo[], index: number) => {
    setLb({ photos, index })
  }, [])

  const closeLightbox = useCallback(() => setLb(null), [])

  const prevPhoto = useCallback(() => {
    setLb(prev => prev && prev.index > 0
      ? { ...prev, index: prev.index - 1 }
      : prev)
  }, [])

  const nextPhoto = useCallback(() => {
    setLb(prev => prev && prev.index < prev.photos.length - 1
      ? { ...prev, index: prev.index + 1 }
      : prev)
  }, [])

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    if (!lb) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     closeLightbox()
      if (e.key === 'ArrowLeft')  prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lb, closeLightbox, prevPhoto, nextPhoto])

  // ── Lock body scroll when lightbox is open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = lb ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lb])

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-sm border-b border-white/8 px-4 pt-7 pb-4 pl-28 md:pl-40 flex items-end justify-between gap-4 flex-wrap">
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
            onClick={() => setActive('all')}
            className={filterCls(active === 'all')}
          >
            all
          </button>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={filterCls(active === s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Gallery ───────────────────────────────────────────────────── */}
      <main className="px-1 pt-1 pb-16">
        {visible.map(session => (
          <section key={session.id} className="mb-1">
            {/* Session label row */}
            <div className="flex items-center gap-4 px-3 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[3px] text-white/25">
                {session.label}
              </span>
              <span className="font-mono text-[9px] text-white/15">{session.date}</span>
              <span className="font-mono text-[9px] text-white/10">{session.photos.length}</span>
            </div>

            {/* Masonry columns */}
            <div
              style={{ columns: 'var(--cols)', columnGap: '2px' }}
              className="[--cols:2] md:[--cols:3] lg:[--cols:4]"
            >
              {session.photos.map((photo, i) => {
                const { width, height } = dims(photo.file)
                const isPriority = i < 4 && active !== 'all' // prioritise first row when filtered
                return (
                  <div
                    key={photo.file}
                    className="break-inside-avoid mb-[2px] cursor-pointer group relative overflow-hidden"
                    onClick={() => openLightbox(session.photos, i)}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.file.replace(/\.[^.]+$/, '')}
                      width={width}
                      height={height}
                      className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-80"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading={isPriority ? 'eager' : 'lazy'}
                      priority={isPriority}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </main>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      {lb && (
        <div
          className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Controls */}
          <button
            onClick={closeLightbox}
            className="fixed top-6 right-7 font-mono text-[9px] uppercase tracking-[3px] text-white/40 hover:text-white/80 transition-colors duration-150 z-10"
          >
            close
          </button>

          <span className="fixed bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-white/25 tracking-widest">
            {lb.index + 1} / {lb.photos.length}
          </span>

          {/* Prev */}
          {lb.index > 0 && (
            <button
              onClick={e => { e.stopPropagation(); prevPhoto() }}
              className="fixed left-4 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[3px] text-white/30 hover:text-white/80 transition-colors duration-150 z-10 px-3 py-6"
            >
              ←
            </button>
          )}

          {/* Next */}
          {lb.index < lb.photos.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); nextPhoto() }}
              className="fixed right-4 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[3px] text-white/30 hover:text-white/80 transition-colors duration-150 z-10 px-3 py-6"
            >
              →
            </button>
          )}

          {/* Image */}
          <div
            className="relative px-12 max-h-screen flex items-center"
            onClick={e => e.stopPropagation()}
          >
            {(() => {
              const photo = lb.photos[lb.index]
              const { width, height } = dims(photo.file)
              return (
                <Image
                  key={photo.src}
                  src={photo.src}
                  alt={photo.file.replace(/\.[^.]+$/, '')}
                  width={width}
                  height={height}
                  className="max-h-screen w-auto object-contain"
                  sizes="100vw"
                  priority
                />
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

function filterCls(isActive: boolean) {
  return [
    'font-mono text-[9px] uppercase tracking-[2px] px-2 py-1 border transition-colors duration-150',
    isActive
      ? 'border-white/40 text-white/80'
      : 'border-white/10 text-white/25 hover:text-white/60 hover:border-white/25',
  ].join(' ')
}
