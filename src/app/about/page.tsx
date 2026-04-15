// src/app/about/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function AboutPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">about</h1>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/40">
          Minneapolis / Saint Paul
        </p>
        <p className="font-mono text-[11px] text-white/30 tracking-wider">
          Multidisciplinary creative and engineering studio — manifesto coming soon.
        </p>
      </div>
    </>
  )
}
