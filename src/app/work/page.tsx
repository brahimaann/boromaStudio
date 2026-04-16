// src/app/work/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'
import { getSessions } from '@/lib/gallery'
import GalleryClient from './GalleryClient'

export default function WorkPage() {
  const sessions = getSessions()
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <GalleryClient sessions={sessions} />
    </>
  )
}
