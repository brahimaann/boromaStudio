// src/app/software/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

const projects = [
  {
    numeral: 'I.',
    category: 'Platform Architecture',
    title: 'Modern Renaissance',
    date: '03.2026',
    stack: 'Next.js / TypeScript / Convex',
    description:
      'Digital ecosystem and community agency infrastructure. Architecture synthesizes technical engineering with creative direction.',
  },
  {
    numeral: 'II.',
    category: 'Audio Processing Utility',
    title: 'wav.warrior',
    date: '02.2026',
    stack: 'Python',
    description:
      'Standalone application for downloading and converting streaming audio into WAV or MP3 formats for engineering workflows.',
  },
  {
    numeral: 'III.',
    category: 'Client Deployment',
    title: 'Jordon King Index',
    date: '04.2026',
    stack: 'Next.js / Tailwind CSS',
    description:
      'High-performance landing architecture and interface development for a professional creative portfolio.',
  },
]

export default function SoftwarePage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />

      {/* White layer — sits above the global bg-black body, fades in on mount */}
      <div className="page-fade-in absolute inset-0 min-h-screen w-full bg-[#F7F7F5] text-black overflow-y-auto z-10">
        <div className="pt-24 pb-40 pl-8 md:pl-56 pr-8 md:pr-20 max-w-[1400px]">

          {/* Page header */}
          <header className="mb-28 pb-6 border-b border-black/15 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="font-mono text-[11px] uppercase tracking-[4px] text-black/40">
              software engineering
            </h1>
            <p className="font-mono text-[10px] tracking-wider text-black/35 max-w-xs text-right leading-relaxed">
              Custom applications &amp; digital infrastructure.<br />
              Structural architecture with definitive direction.
            </p>
          </header>

          {/* Project index */}
          <div className="space-y-28">
            {projects.map((project, i) => (
              <article key={i} className="border-t border-black/10 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6">

                  {/* Left — metadata */}
                  <div className="lg:col-span-3 flex flex-col gap-5">
                    <span className="font-mono text-[10px] text-black/30 tracking-widest">
                      {project.numeral}
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-[9px] uppercase tracking-[2px] text-black/35">
                        {project.category}
                      </p>
                      <h2 className="font-mono text-[13px] tracking-wide text-black">
                        {project.title}
                      </h2>
                      <p className="font-mono text-[10px] text-black/35">
                        {project.date}
                      </p>
                    </div>
                    <span className="font-mono text-[9px] text-black/40 border border-black/10 px-2 py-1 w-fit mt-auto">
                      {project.stack}
                    </span>
                  </div>

                  {/* Right — media placeholder + caption */}
                  <div className="lg:col-span-9">
                    <div className="aspect-[16/9] w-full bg-black/[0.04] border border-black/[0.06] mb-5 flex items-center justify-center">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-black/15">
                        media asset
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <p className="md:col-span-8 font-mono text-[10px] leading-loose text-black/55">
                        <span className="uppercase tracking-widest text-black/30 mr-3">
                          Fig {i + 1}.
                        </span>
                        {project.description}
                      </p>
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
