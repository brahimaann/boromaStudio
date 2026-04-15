// src/app/contact/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function ContactPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="min-h-screen pt-20 px-8 pb-16">
        <h1 className="mb-8 font-mono text-[11px] uppercase tracking-widest text-white/60">contact</h1>
        <form className="flex flex-col gap-6 max-w-md">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Project Scope
            </label>
            <textarea
              className="bg-transparent border border-white/20 font-mono text-white text-xs tracking-wider p-3 resize-none h-24 outline-none focus:border-white/50 transition-colors"
              placeholder="Describe your project..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Budget Tier
            </label>
            <select className="bg-black border border-white/20 font-mono text-white text-xs tracking-wider p-3 outline-none focus:border-white/50 transition-colors appearance-none">
              <option value="">Select a tier</option>
              <option value="under-5k">Under $5,000</option>
              <option value="5k-15k">$5,000 – $15,000</option>
              <option value="15k-50k">$15,000 – $50,000</option>
              <option value="50k-plus">$50,000+</option>
            </select>
          </div>
          <button
            type="submit"
            className="self-start border border-white/30 font-mono text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:border-white/70 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  )
}
