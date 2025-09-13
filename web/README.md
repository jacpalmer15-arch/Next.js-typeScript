# Zenith Admin Frontend

Front end of Self Checkout App - A Next.js TypeScript application for managing products, inventory, and sync operations.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run test` - Run the test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Testing

This project uses Jest and React Testing Library for testing.

### Test Structure

```
__tests__/
├── components/
│   ├── ui/           # UI component tests
│   └── products/     # Product-related component tests
├── pages/            # Page-level integration tests
└── test-utils.tsx    # Testing utilities and custom render
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Writing Tests

Tests should follow these conventions:
- Use the custom `render` function from `test-utils.tsx` for components that need providers
- Mock external dependencies (APIs, Next.js router, etc.) in `jest.setup.js`
- Focus on testing user interactions and component behavior
- Use React Testing Library best practices (query by role, accessible name, etc.)

Example test:
```tsx
import { render, screen } from '../test-utils'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  test('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration with the following workflow:

### Workflow Stages

1. **Lint**: ESLint code quality checks
2. **Type Check**: TypeScript compilation verification  
3. **Test**: Jest unit and integration tests with coverage
4. **Build**: Next.js production build verification

> **Note**: The current codebase has some existing ESLint and TypeScript issues that need to be addressed separately. The CI pipeline is configured to run checks but may fail on these pre-existing issues. The test suite, however, is fully functional and validates the test infrastructure and new components.

### Workflow Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Matrix Testing

Tests run on multiple Node.js versions:
- Node.js 18
- Node.js 20

### Artifacts

- Test coverage reports (uploaded to Codecov)
- Build artifacts (retained for 7 days)

## Project Structure

```
web/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   ├── products/          # Product management pages
│   ├── inventory/         # Inventory management pages
│   └── sync/              # Sync operations pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── products/         # Product-related components
├── lib/                   # Utility functions and types
├── __tests__/            # Test files
└── public/               # Static assets
```

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Database**: Supabase
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with Next.js configuration

## Contributing

1. Create a feature branch from `develop`
2. Make your changes with appropriate tests
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Ensure build succeeds: `npm run build`
6. Create a pull request

The CI pipeline will automatically run tests, linting, and build verification on all pull requests.
