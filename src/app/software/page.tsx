// src/app/software/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function SoftwarePage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">software</h1>
        <p className="font-mono text-[11px] text-white/30 tracking-wider">
          Engineering logic and deployed products — coming soon.
        </p>
      </div>
    </>
  )
}
