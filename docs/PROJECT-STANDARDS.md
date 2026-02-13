# Project Standards - Portfolio

## Overview
This portfolio is a production-ready, full-stack Next.js application built with modern web technologies and best practices.

## Tech Stack

### Core Framework
- **Next.js 16** with App Router
- **TypeScript 5** for type safety
- **React 19** for UI components

### Styling
- **Tailwind CSS 4** for utility-first styling
- **shadcn/ui** component library (New York style)
- **Framer Motion** for animations
- **next-themes** for dark mode support

### Database & State Management
- **Prisma ORM** with SQLite client
- **Zustand** for client state
- **TanStack Query** for server state

### Authentication & Security
- **Custom admin authentication** (Bearer token + signed session cookie)
- Input validation and sanitization
- XSS protection
- API hardening headers and rate limiting

### Internationalization (i18n)
- Built-in i18n support
- English (en) and Persian (fa) languages
- RTL/LTR direction support

### SEO & Performance
- Dynamic meta tags
- Sitemap generation
- Robots.txt
- OG images generation
- Image optimization with next/image
- Core Web Vitals tracking

## Code Standards

### File Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Header, Footer)
│   ├── sections/          # Page sections (Hero, Portfolio, etc.)
│   ├── theme/             # Theme components
│   └── seo/               # SEO components
├── lib/
│   ├── db/                # Prisma client
│   ├── i18n/             # Internationalization
│   └── seo/               # SEO utilities
└── hooks/                  # Custom React hooks
```

### Naming Conventions

#### Files
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useUserData.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL.ts`)

#### Variables & Functions
- camelCase for variables and functions
- PascalCase for React components
- UPPERCASE for constants

### TypeScript Guidelines

1. **Always use types**: Avoid `any` type
2. **Use interfaces for object shapes**: Especially for props and API responses
3. **Use type aliases for union types**: Improves readability
4. **Enable strict mode**: In `tsconfig.json`

Example:
```typescript
// ✅ Good
interface UserProps {
  name: string
  email: string
  age?: number
}

const user: UserProps = {
  name: 'John',
  email: 'john@example.com',
}

// ❌ Bad
const user: any = {
  name: 'John',
}
```

### React Best Practices

1. **Use functional components**: Prefer functional over class components
2. **Use hooks for state and side effects**: No class lifecycle methods
3. **Keep components small and focused**: Single responsibility principle
4. **Use TypeScript for props**: Define interfaces for all component props
5. **Use `'use client'` directive**: For components that use hooks or browser APIs
6. **Use `'use server'` directive**: For server actions and API routes

Example:
```typescript
'use client'

import { useState, useEffect } from 'react'

interface CounterProps {
  initialValue?: number
}

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue)

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

### Styling Guidelines

1. **Use Tailwind utilities**: Prefer utility classes over custom CSS
2. **Use semantic color tokens**: `bg-primary`, `text-muted-foreground`
3. **Use spacing scale**: Tailwind's spacing scale (4, 8, 16, etc.)
4. **Use responsive prefixes**: `sm:`, `md:`, `lg:` for responsive design
5. **Avoid inline styles**: Use Tailwind classes instead
6. **Use component classes**: For reusable styles

Example:
```typescript
// ✅ Good
<div className="flex items-center gap-4 p-6 bg-primary/10 rounded-lg">

// ❌ Bad
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
```

### API Route Guidelines

1. **Use async functions**: All API routes should be async
2. **Proper error handling**: Use try-catch blocks
3. **Validate inputs**: Always validate and sanitize user input
4. **Return proper HTTP status codes**: 200, 400, 401, 404, 500, etc.
5. **Use TypeScript interfaces**: Define request/response types

Example:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate and sanitize
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      )
    }

    // Process request
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Accessibility (a11y)

1. **Use semantic HTML**: `<main>`, `<header>`, `<nav>`, `<section>`, etc.
2. **Add alt text**: For all images
3. **Use ARIA labels**: For interactive elements without visible labels
4. **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
5. **Color contrast**: Follow WCAG AA guidelines (4.5:1 for normal text)
6. **Focus indicators**: Clear focus styles for keyboard navigation

### Performance Guidelines

1. **Use dynamic imports**: For heavy components and libraries
2. **Code splitting**: Next.js automatically splits by route
3. **Image optimization**: Use `next/image` for all images
4. **Lazy loading**: Use `loading="lazy"` for images and iframes
5. **Memoization**: Use `useMemo` and `useCallback` when needed
6. **Bundle analysis**: Monitor bundle size regularly

Example:
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})
```

### SEO Guidelines

1. **Unique meta titles**: Each page should have a unique, descriptive title
2. **Meta descriptions**: 150-160 characters, include keywords
3. **Canonical URLs**: Prevent duplicate content issues
4. **Structured data**: Use JSON-LD for rich snippets
5. **Sitemap**: Keep sitemap.xml updated
6. **Robots.txt**: Configure crawling rules
7. **Open Graph**: Enable social sharing previews

### Security Guidelines

1. **Never trust user input**: Always validate and sanitize
2. **Use prepared statements**: For database queries
3. **HTTPS only**: In production
4. **Security headers**: X-Frame-Options, X-Content-Type-Options, etc.
5. **Rate limiting**: Implement rate limiting for API routes
6. **Environment variables**: Never commit secrets, use `.env` files

### Git Workflow

1. **Feature branches**: Create a branch for each feature
2. **Commit messages**: Use conventional commits (feat:, fix:, docs:, etc.)
3. **Pull requests**: Review before merging
4. **Semantic versioning**: Use semantic versioning for releases

Example commit messages:
```
feat: Add dark mode toggle component
fix: Correct RTL layout issue in header
docs: Update README with deployment instructions
refactor: Simplify contact form validation
```

### Testing Guidelines

1. **Unit tests**: Test individual functions and components
2. **Integration tests**: Test component interactions
3. **E2E tests**: Test user flows
4. **Coverage**: Aim for 80%+ code coverage
5. **Test accessibility**: Include a11y tests

## Deployment

### Prerequisites
- Node.js 18+
- Bun package manager
- Database (SQLite by default; PostgreSQL after explicit Prisma migration)

### Build & Deploy
```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linter
bun run lint
```

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
ADMIN_API_TOKEN="replace-with-strong-token-min-16"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="replace-with-strong-password-min-8"
ADMIN_SESSION_SECRET="replace-with-strong-secret-min-32"
API_RATE_LIMIT_WINDOW_MS="900000"
API_RATE_LIMIT_MAX_REQUESTS="5"
```

## Contributing

1. Follow these standards
2. Write tests for new features
3. Update documentation
4. Submit pull requests

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Framer Motion](https://www.framer.com/motion)
