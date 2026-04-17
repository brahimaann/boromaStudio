// jest.setup.ts
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))
