// src/app/portal/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function PortalPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">portal</h1>
        <form className="flex flex-col gap-6 max-w-xs">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Email
            </label>
            <input
              type="email"
              className="bg-transparent border border-white/20 font-mono text-white text-xs tracking-wider p-3 outline-none focus:border-white/50 transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Password
            </label>
            <input
              type="password"
              className="bg-transparent border border-white/20 font-mono text-white text-xs tracking-wider p-3 outline-none focus:border-white/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="self-start border border-white/30 font-mono text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:border-white/70 transition-colors"
          >
            Access Portal
          </button>
        </form>
      </div>
    </>
  )
}
