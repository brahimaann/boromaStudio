// src/app/about/page.tsx
import NavigationOverlay from '@/components/NavigationOverlay'
import { navLinks } from '@/lib/nav'

export default function AboutPage() {
  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div className="flex min-h-screen w-full items-center justify-center pl-48 md:pl-56 pr-8">
        {/* 9:16 Aspect Ratio Container */}
        <div className="aspect-[9/16] w-full max-w-sm flex items-center justify-center border border-white/10 p-6">
          <pre className="font-mono text-[10px] sm:text-[11px] leading-loose text-white/80 whitespace-pre-wrap break-words">
            <code className="language-java">
{`String about_boroma =
  "Boroma Studios is a multidisciplinary " +
  "agency operating at the intersection " +
  "of technical engineering and high- " +
  "fidelity media production. Based in " +
  "Minneapolis and Saint Paul, the " +
  "studio synthesizes structural " +
  "software architecture with definitive " +
  "creative direction.\\n\\n" +

  "We maintain distinct but parallel " +
  "verticals. The engineering branch " +
  "develops custom applications and " +
  "digital infrastructure. The media " +
  "branch executes professional " +
  "photography, video production, and " +
  "audio engineering.\\n\\n" +

  "Additionally, the studio executes " +
  "comprehensive creative direction for " +
  "brands, corporate entities, and " +
  "organizational groups, architecting " +
  "unified visual and technical " +
  "identities. This multi-tiered model " +
  "ensures rigorous operational " +
  "capability without compromising " +
  "aesthetic execution.\\n\\n" +

  "LOCATION: Minneapolis / Saint Paul";`}
            </code>
          </pre>
        </div>
      </div>
    </>
  )
}
