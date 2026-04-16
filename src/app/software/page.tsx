// src/app/software/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

const projects = [
  {
    numeral: 'I.',
    category: 'Platform Architecture',
    title: 'Modern Renaissance',
    date: '01.2026',
    stack: 'JavaScript',
    description:
      'Digital ecosystem and community agency infrastructure. Contact and identity layer for the MRND platform.',
    github: 'https://github.com/brahimaann/mrndcontact',
  },
  {
    numeral: 'II.',
    category: 'Audio Processing Utility',
    title: 'YT2WAV',
    date: '03.2026',
    stack: 'Python',
    description:
      'Standalone application for downloading and converting streaming audio into WAV or MP3 formats for professional engineering workflows.',
    github: 'https://github.com/brahimaann/YT2WAV',
  },
  {
    numeral: 'III.',
    category: 'Client Deployment',
    title: 'Jordon King Landing',
    date: '04.2026',
    stack: 'TypeScript / Next.js',
    description:
      'High-performance landing architecture and interface development for a professional creative portfolio.',
    github: 'https://github.com/brahimaann/JORDON-KING-LANDING',
  },
  {
    numeral: 'IV.',
    category: 'Audio Engineering Tool',
    title: 'VST Scanner',
    date: '04.2026',
    stack: 'Python / PySide6',
    description:
      'Standalone VST2/VST3 plugin scanner with Supreme-inspired UI. Indexes and catalogues audio plugins across the system.',
    github: 'https://github.com/brahimaann/vst-scanner',
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
                    <div className="flex flex-col gap-2 mt-auto">
                      <span className="font-mono text-[9px] text-black/40 border border-black/10 px-2 py-1 w-fit">
                        {project.stack}
                      </span>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[9px] uppercase tracking-[2px] text-black/35 hover:text-black transition-colors duration-150 flex items-center gap-1.5 w-fit"
                      >
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        github
                      </a>
                    </div>
                  </div>

                  {/* Right — media placeholder + caption */}
                  <div className="lg:col-span-9">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-[16/9] w-full bg-black/[0.04] border border-black/[0.06] mb-5 flex items-center justify-center hover:bg-black/[0.07] transition-colors duration-200 group"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-widest text-black/15 group-hover:text-black/25 transition-colors duration-200">
                        view on github →
                      </span>
                    </a>
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
