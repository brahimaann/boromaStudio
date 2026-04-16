'use client'

// src/app/capabilities/page.tsx
import { useState } from 'react'
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

// ─── Data ─────────────────────────────────────────────────────────────────────

type Proof = { label: string; href: string | null; status: 'live' | 'pending' }

type Capability = {
  id: string
  title: string
  description: string
  requirements: string[]
  proofs: Proof[]
  tags: string[]
}

const capabilities: Capability[] = [
  {
    id: '01',
    title: 'Software Engineering',
    description:
      'Custom application development and digital infrastructure. Full-stack architecture from schema to deployment.',
    requirements: [
      'Technology stacks and database architectures per project',
      'Repository links, staging URLs, and active production domains',
    ],
    proofs: [
      { label: 'Modern Renaissance', href: 'https://github.com/brahimaann/mrndcontact', status: 'live' },
      { label: 'wav.warrior', href: 'https://github.com/brahimaann/YT2WAV', status: 'live' },
      { label: 'Jordon King Index', href: 'https://github.com/brahimaann/JORDON-KING-LANDING', status: 'live' },
      { label: 'VST Scanner', href: 'https://github.com/brahimaann/vst-scanner', status: 'live' },
    ],
    tags: ['Next.js', 'TypeScript', 'Python', 'React', 'Convex', 'Tailwind CSS'],
  },
  {
    id: '02',
    title: 'Creative Coding',
    description:
      'Generative visual systems, real-time data pipelines, and interactive media. Hardware-linked node networks for live performance and installation.',
    requirements: [
      'Hardware dependencies and node networks in generative workflows',
      '15-second captures of active TouchDesigner networks — blob tracking and data moshing',
    ],
    proofs: [
      { label: 'Blob tracking network — TouchDesigner', href: null, status: 'pending' },
      { label: 'Data moshing demo — real-time export', href: null, status: 'pending' },
    ],
    tags: ['TouchDesigner', 'GLSL', 'Python', 'OSC', 'WebGL'],
  },
  {
    id: '03',
    title: 'Media Production',
    description:
      'Photography, video direction, and editorial execution for cultural and commercial clients. Minneapolis / Saint Paul and regional.',
    requirements: [
      'Camera formats and focal lengths per client work',
      'Lookbook tear sheets, editorial spreads, and commercial photo set documentation',
    ],
    proofs: [
      { label: 'The Heart of the Cities Vol. 1 — editorial spread', href: null, status: 'pending' },
      { label: 'Bird Watching Collection — Lake Nokomis', href: null, status: 'pending' },
      { label: 'ACAP Headshots — commercial set', href: null, status: 'pending' },
    ],
    tags: ['Canon EOS R', 'Fujifilm X', 'Premiere Pro', 'Lightroom', 'Capture One'],
  },
  {
    id: '04',
    title: 'Audio Engineering',
    description:
      'Vocal processing, mixing, and mastering for recording and production workflows. Signal chain architecture from tracking to final master.',
    requirements: [
      'Signal chains for vocal processing, mixing, and mastering',
      '30-second lossless stems demonstrating before-and-after processing states',
    ],
    proofs: [
      { label: 'Vocal chain — before/after lossless stems', href: null, status: 'pending' },
      { label: 'Mix reference — full lossless export', href: null, status: 'pending' },
    ],
    tags: ['Pro Tools', 'Logic Pro', 'UAD', 'Waves', 'iZotope Ozone'],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function CapabilitiesPage() {
  const [active, setActive] = useState<string | null>(null)

  const toggle = (id: string) => setActive(prev => prev === id ? null : id)

  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />

      <div className="min-h-screen bg-black text-white pt-24 pb-32 pl-8 md:pl-40 pr-8 md:pr-20">

        {/* Page label */}
        <p className="font-mono text-[9px] uppercase tracking-[4px] text-white/25 mb-20">
          capabilities // service index
        </p>

        {/* Capability rows */}
        <div className="divide-y divide-white/8">
          {capabilities.map((cap) => {
            const isOpen = active === cap.id

            return (
              <div key={cap.id}>

                {/* ── Trigger row ─────────────────────────────────── */}
                <button
                  onClick={() => toggle(cap.id)}
                  className="w-full flex items-baseline gap-6 md:gap-10 py-7 text-left group cursor-pointer bg-transparent border-none"
                >
                  {/* Number */}
                  <span
                    className={[
                      'font-display text-[clamp(2rem,5vw,3.5rem)] leading-none tracking-tight transition-opacity duration-300 shrink-0',
                      isOpen ? 'opacity-100' : 'opacity-20 group-hover:opacity-60',
                    ].join(' ')}
                  >
                    {cap.id}
                  </span>

                  {/* Title */}
                  <span
                    className={[
                      'font-display text-[clamp(1.8rem,5vw,3.5rem)] leading-none uppercase tracking-[2px] transition-opacity duration-300',
                      isOpen ? 'opacity-100' : 'opacity-40 group-hover:opacity-80',
                    ].join(' ')}
                  >
                    {cap.title}
                  </span>

                  {/* Expand indicator */}
                  <span
                    className={[
                      'ml-auto font-mono text-[9px] tracking-widest text-white/30 shrink-0 transition-transform duration-300',
                      isOpen ? 'rotate-45' : '',
                    ].join(' ')}
                  >
                    +
                  </span>
                </button>

                {/* ── Expandable detail panel ──────────────────────── */}
                <div
                  className="grid transition-[grid-template-rows] duration-400 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="pb-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">

                      {/* Description + tags */}
                      <div className="md:col-span-4 flex flex-col gap-6">
                        <p className="font-mono text-[10px] leading-loose text-white/50 tracking-wide">
                          {cap.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cap.tags.map(tag => (
                            <span
                              key={tag}
                              className="font-mono text-[8px] uppercase tracking-[2px] text-white/30 border border-white/10 px-2 py-0.5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Data requirements */}
                      <div className="md:col-span-4 flex flex-col gap-4">
                        <p className="font-mono text-[8px] uppercase tracking-[3px] text-white/20 mb-1">
                          Data Requirements
                        </p>
                        <ul className="flex flex-col gap-3">
                          {cap.requirements.map((req, i) => (
                            <li key={i} className="flex gap-3 items-start">
                              <span className="font-mono text-[8px] text-white/15 mt-[3px] shrink-0">—</span>
                              <span className="font-mono text-[10px] leading-loose text-white/40 tracking-wide">
                                {req}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Proof of execution */}
                      <div className="md:col-span-4 flex flex-col gap-4">
                        <p className="font-mono text-[8px] uppercase tracking-[3px] text-white/20 mb-1">
                          Proof of Execution
                        </p>
                        <ul className="flex flex-col gap-3">
                          {cap.proofs.map((proof, i) => (
                            <li key={i} className="flex gap-3 items-start">
                              <span
                                className={[
                                  'font-mono text-[8px] mt-[3px] shrink-0',
                                  proof.status === 'live' ? 'text-white/40' : 'text-white/15',
                                ].join(' ')}
                              >
                                {proof.status === 'live' ? '↗' : '○'}
                              </span>
                              {proof.href ? (
                                <a
                                  href={proof.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-[10px] leading-loose text-white/60 tracking-wide hover:text-white transition-colors duration-150 underline underline-offset-4 decoration-white/20"
                                >
                                  {proof.label}
                                </a>
                              ) : (
                                <span className="font-mono text-[10px] leading-loose text-white/20 tracking-wide">
                                  {proof.label}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}
