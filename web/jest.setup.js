

import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [],
        error: null,
      })),
      insert: jest.fn(() => ({
        data: [],
        error: null,
      })),
      update: jest.fn(() => ({
        data: [],
        error: null,
      })),
      delete: jest.fn(() => ({
        data: [],
        error: null,
      })),
    })),
  })),
}))

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: undefined,
    error: null,
    isLoading: false,
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }) => children,
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }) => children,
}))

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}
