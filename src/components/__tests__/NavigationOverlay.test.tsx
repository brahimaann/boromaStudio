// src/components/__tests__/NavigationOverlay.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import NavigationOverlay from '../NavigationOverlay'

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

const testLinks = [
  { label: 'software', href: '/software' },
  { label: 'media', href: '/media' },
  { label: 'about', href: '/about' },
]

describe('NavigationOverlay', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  it('renders the wordmark in all states', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByText('boroma studios')).toBeInTheDocument()
  })

  it('shows nav links when defaultOpen is true', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByRole('link', { name: /software/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /media/i })).toBeInTheDocument()
  })

  it('hides nav links when defaultOpen is false', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={false} />)
    expect(screen.queryByRole('link', { name: /software/i })).not.toBeInTheDocument()
  })

  it('shows nav links after clicking the wordmark trigger when closed', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={false} />)
    fireEvent.click(screen.getByText('boroma studios'))
    expect(screen.getByRole('link', { name: /software/i })).toBeInTheDocument()
  })

  it('hides nav links after clicking close button', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    fireEvent.click(screen.getByText('close'))
    expect(screen.queryByRole('link', { name: /software/i })).not.toBeInTheDocument()
  })

  it('renders nav links with correct hrefs', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByRole('link', { name: /software/i })).toHaveAttribute('href', '/software')
  })

  it('applies active styles to the current route link', () => {
    mockUsePathname.mockReturnValue('/software')
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    const activeLink = screen.getByRole('link', { name: /software/i })
    expect(activeLink).toHaveClass('line-through')
  })

  it('does not apply active styles to non-current route links', () => {
    mockUsePathname.mockReturnValue('/software')
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByRole('link', { name: /media/i })).not.toHaveClass('line-through')
  })

  it('renders social icons container when open', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    expect(screen.getByTestId('social-icons')).toBeInTheDocument()
  })

  it('social icons container has hidden md:flex classes', () => {
    render(<NavigationOverlay links={testLinks} defaultOpen={true} />)
    const socials = screen.getByTestId('social-icons')
    expect(socials).toHaveClass('hidden')
    expect(socials).toHaveClass('md:flex')
  })
})
