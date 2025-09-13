# Next.js-typeScript
Front end of Self Checkout App with Admin Authentication

## Features

- **Admin Authentication**: Secure login/logout with Supabase Auth
- **Protected Routes**: Route guards for admin-only access
- **Responsive Design**: Mobile-friendly admin interface with sidebar navigation
- **Product Management**: View, search, and manage products
- **Inventory Tracking**: Monitor stock levels and low-stock alerts
- **Data Synchronization**: Sync products and inventory with external systems
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test coverage with Jest and React Testing Library

## Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase project (for authentication)

### Installation

1. Install dependencies:
```bash
cd web
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase configuration:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Set up Supabase Authentication:
   - Create a Supabase project at https://supabase.com
   - Enable Email authentication in Authentication > Settings
   - Create admin users in Authentication > Users

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the admin interface.

### Authentication Flow

1. **Unauthenticated users** are redirected to `/auth/login`
2. **Login** with email/password using Supabase Auth
3. **Authenticated users** access the admin dashboard with sidebar navigation
4. **Session management** handles token refresh and logout
5. **Route protection** ensures only authenticated users access admin features

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

### Building

Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── auth/login/        # Login page
│   ├── products/          # Product management
│   ├── inventory/         # Inventory tracking  
│   ├── sync/              # Data synchronization
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (sidebar, header)
│   ├── products/          # Product-specific components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and configuration
│   ├── auth-context.tsx   # Authentication context
│   ├── auth-types.ts      # Auth-related TypeScript types
│   ├── supabase.ts        # Supabase client configuration
│   └── api.ts             # API client with auth headers
└── __tests__/             # Test files
```

## Authentication Implementation

### Components

- **AuthProvider**: Manages authentication state and session
- **AuthGuard**: Protects routes and components requiring authentication
- **LoginForm**: Handles user login with error handling
- **AdminLayout**: Secure layout with sidebar, header, and navigation
- **AdminSidebar**: Responsive navigation with user info and logout
- **AdminHeader**: Header with user details and quick logout

### Session Management

- Automatic session restoration on app load
- Token-based API authentication via Authorization headers
- Automatic redirect on session expiration
- Logout functionality with session cleanup

### Security Features

- Route protection for all admin pages
- API requests include authentication headers
- Session validation on protected routes
- Secure token storage via Supabase Auth

## API Integration

The API client automatically includes authentication headers for all requests. Configure backend services to validate the Authorization header containing the Supabase JWT token.

## Contributing

1. Create feature branch from `copilot-generated-branch`
2. Implement changes with tests
3. Run linting and tests: `npm run lint && npm test`
4. Submit pull request

## Environment Variables

See `.env.example` for required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
