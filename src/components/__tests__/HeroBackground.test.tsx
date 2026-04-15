// src/components/__tests__/HeroBackground.test.tsx
import { render, screen } from '@testing-library/react'
import HeroBackground from '../HeroBackground'

describe('HeroBackground', () => {
  it('renders a video element with correct src', () => {
    render(<HeroBackground src="/hero.mp4" />)
    const video = screen.getByTestId('hero-video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/hero.mp4')
  })

  it('sets loop and playsInline on the video', () => {
    render(<HeroBackground src="/hero.mp4" />)
    const video = screen.getByTestId('hero-video')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
  })

  it('renders the dark overlay', () => {
    render(<HeroBackground src="/hero.mp4" />)
    expect(screen.getByTestId('hero-overlay')).toBeInTheDocument()
  })

  it('renders optional poster attribute when provided', () => {
    render(<HeroBackground src="/hero.mp4" poster="/poster.jpg" />)
    const video = screen.getByTestId('hero-video')
    expect(video).toHaveAttribute('poster', '/poster.jpg')
  })
})
