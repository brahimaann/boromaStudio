// src/app/page.tsx
import HeroBackground from '@/components/HeroBackground'
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <HeroBackground src="/hero.mp4" />
      <NavigationOverlay links={navLinks} defaultOpen={true} />
    </main>
  )
}
