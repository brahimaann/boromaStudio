// jest.setup.ts
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))
