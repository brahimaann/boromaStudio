// src/app/layout.tsx
import type { Metadata } from 'next'
import { JetBrains_Mono, Bebas_Neue } from 'next/font/google'
import PendulumLoader from '@/components/PendulumLoader'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jetbrains-mono',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
})

export const metadata: Metadata = {
  title: 'Boroma Studios',
  description: 'Multidisciplinary creative and engineering studio. Minneapolis / Saint Paul.',
  icons: [
    { rel: 'icon', url: '/favicon-dark.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/Dwennimmen-Adinkra-Symbol.ico', media: '(prefers-color-scheme: light)', type: 'image/x-icon' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} ${bebasNeue.variable} bg-black text-white`}>
        <PendulumLoader>
          {children}
        </PendulumLoader>
      </body>
    </html>
  )
}
