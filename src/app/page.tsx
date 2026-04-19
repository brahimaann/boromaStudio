// src/app/page.tsx
import HeroBackground from '@/components/HeroBackground'
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <HeroBackground src="https://res.cloudinary.com/dx3gpmtby/video/upload/v1776625608/hero_qb3zbw.mp4" />
      <NavigationOverlay links={navLinks} defaultOpen={false} />
    </main>
  )
}
