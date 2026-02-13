# Architecture Documentation

## System Overview

This portfolio is a modern, full-stack web application built with Next.js 16, following the principles of performance, accessibility, and maintainability.

## Architecture Pattern

### Client-Side Rendering (CSR) vs Server-Side Rendering (SSR)

- **SSR by default**: Most components are server components for better performance and SEO
- **CSR when needed**: Client components (`'use client'`) for interactivity (forms, animations, state)
- **Hybrid approach**: Optimal balance between SEO and user experience

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│    (React Components, UI/UX)        │
├─────────────────────────────────────────┤
│         Business Logic Layer           │
│     (Custom Hooks, Services)        │
├─────────────────────────────────────────┤
│         Data Access Layer             │
│    (Prisma ORM, API Routes)        │
├─────────────────────────────────────────┤
│         Database Layer                │
│    (SQLite dev, PostgreSQL prod)     │
└─────────────────────────────────────────┘
```

## Component Architecture

### Component Hierarchy

```
RootLayout (app/layout.tsx)
├── I18nProvider (Context for language)
│   └── ThemeProvider (next-themes)
│       ├── Header
│       │   ├── Navigation
│       │   ├── Language Switcher
│       │   └── Theme Toggle
│       ├── Main Content (children)
│       │   └── Page Components
│       │       ├── Hero
│       │       ├── About
│       │       ├── Portfolio
│       │       ├── Skills
│       │       ├── Experience
│       │       ├── Testimonials
│       │       ├── Services
│       │       ├── FAQ
│       │       ├── Blog
│       │       └── Contact
│       ├── Footer
│       ├── BottomNav (Mobile)
│       └── Toaster (Notifications)
```

### Component Categories

#### 1. Layout Components
Located in `src/components/layout/`
- **Header**: Navigation, language/theme toggles
- **Footer**: Links, social media, copyright
- **BottomNav**: Mobile navigation

#### 2. Section Components
Located in `src/components/sections/`
- **Hero**: Landing section with CTA
- **About**: Personal information and bio
- **Portfolio**: Project showcase with filtering
- **Skills**: Technical skills display
- **Experience**: Work history and education
- **Testimonials**: Client reviews
- **Services**: Service offerings and pricing
- **FAQ**: Frequently asked questions
- **Blog**: Articles and newsletter
- **Contact**: Contact form and info

#### 3. UI Components
Located in `src/components/ui/` (shadcn/ui)
- **Button**: Reusable button with variants
- **Card**: Container component
- **Input**: Form input with validation
- **Dialog**: Modal dialogs
- **Select**: Dropdown selects
- And more...

#### 4. Theme Components
Located in `src/components/theme/`
- **ThemeProvider**: Theme context and provider
- **ThemeToggle**: Dark/light mode toggle

#### 5. SEO Components
Located in `src/components/seo/`
- **JsonLd**: Structured data
- **MetaTags**: Dynamic meta tags

## State Management

### Client State (Zustand)
Used for complex client-side state:
```typescript
interface AppState {
  theme: 'light' | 'dark'
  language: 'en' | 'fa'
  notifications: Notification[]
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  language: 'fa',
  notifications: [],
  // Actions...
}))
```

### Server State (TanStack Query)
Used for data fetching:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
})
```

### Context API
Used for app-wide state:
- **I18nContext**: Language and translations
- **ThemeContext**: Theme preference

## Data Flow

### Form Submission Flow

```
User Input (Contact Form)
    ↓
Validation (Client-side)
    ↓
Sanitization (XSS protection)
    ↓
POST to /api/contact
    ↓
Server-side Validation
    ↓
Process (validation + security checks + logging)
    ↓
Response to Client
```

### Project Display Flow

```
Page Load
    ↓
Fetch Projects (Static/SSR)
    ↓
Filter/Search (Client)
    ↓
Update Display (Re-render)
```

## Internationalization (i18n)

### Architecture

```
translations.ts (Key-value pairs)
    ↓
I18nContext (React Context)
    ↓
useI18n Hook (Custom Hook)
    ↓
Components (Use t() function)
```

### Implementation

1. **Translation Files**: `src/lib/i18n/translations.ts`
2. **Context Provider**: `src/lib/i18n-context.tsx`
3. **Custom Hook**: `useI18n()`
4. **Direction Handling**: RTL for Persian, LTR for English

## Routing Strategy

### Next.js App Router

- **File-based routing**: `src/app/` directory structure
- **Dynamic Routes**: `[slug]` folders for dynamic content
- **API Routes**: `src/app/api/` for backend endpoints
- **Auth enforcement**: Route-level checks in admin API handlers

### Route Structure

```
src/app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── api/                # API routes
│   ├── contact/        # Contact form
│   ├── og-image/       # OG image generation
│   └── rss/            # RSS feed
├── sitemap.ts          # Sitemap generation
└── robots.ts           # Robots.txt
```

## Performance Optimization

### Code Splitting

- **Automatic**: Next.js splits code by route
- **Dynamic Imports**: Load heavy components on demand
- **Tree Shaking**: Remove unused code in production

### Image Optimization

- **next/image**: Automatic optimization and responsive images
- **Formats**: AVIF, WebP with fallbacks
- **Lazy Loading**: Images load as needed
- **Placeholder**: Blur or color placeholders

### Caching Strategy

- **Static Assets**: Long cache (1 year)
- **API Responses**: Short cache (5-60 seconds)
- **CDN**: Vercel CDN for static files
- **Browser Caching**: Cache-Control headers

### Bundle Optimization

```javascript
// next.config.ts
experimental: {
  optimizePackageImports: ['lucide-react', 'framer-motion'],
}
```

## Security Architecture

### Input Validation

1. **Client-side**: HTML5 validation, React validation
2. **Server-side**: Type checking, regex validation
3. **Sanitization**: Remove dangerous characters, prevent XSS

### Authentication

- **Custom Admin Auth**: Bearer token (`ADMIN_API_TOKEN`) or signed session cookie
- **Session Management**: HMAC-signed `asdev_admin_session` cookie
- **Credential Checks**: Timing-safe comparison for secrets

### Security Headers

```javascript
// next.config.ts
headers: [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]
```

## SEO Architecture

### Meta Tags

- **Dynamic**: Based on page content
- **Open Graph**: Social media previews
- **Twitter Cards**: Twitter-specific meta
- **Canonical URLs**: Prevent duplicate content

### Structured Data

- **JSON-LD**: Schema.org markup
- **Person**: Developer information
- **WebSite**: Site information
- **Organization**: Company details
- **Breadcrumb**: Navigation structure

### Performance SEO

- **Core Web Vitals**: LCP, FID, CLS
- **Mobile-Friendly**: Responsive design
- **Fast Loading**: Optimized bundle size
- **Sitemap**: XML sitemap for crawlers

## Development Workflow

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run linter
bun run lint
```

### Code Quality

- **ESLint**: Linting for code quality
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Git Hooks**: Pre-commit checks

### Testing

```bash
# Unit tests
bun test

# E2E tests
bun test:e2e

# Coverage
bun test:coverage
```

## Deployment Architecture

### Production Build

1. **Build**: `bun run build`
2. **Optimize**: Code splitting, minification
3. **Deploy**: Vercel/Netlify/AWS

### Environment Management

```bash
# Development
.env.local

# Production
.env.production

# Variables
DATABASE_URL
ADMIN_API_TOKEN
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
API_RATE_LIMIT_WINDOW_MS
API_RATE_LIMIT_MAX_REQUESTS
```

## Scalability Considerations

### Database

- **Development**: SQLite (file-based)
- **Production (current)**: SQLite by default
- **Production (scalable option)**: migrate Prisma schema to PostgreSQL
- **Connection Pooling**: Prisma connection pool
- **Caching**: Redis for frequent queries

### CDN

- **Static Assets**: CDN for images, fonts, CSS
- **Edge Caching**: Vercel Edge Network
- **Geographic Distribution**: Global edge locations

### Performance Monitoring

- **Web Vitals**: Track Core Web Vitals
- **Error Tracking**: Sentry or similar
- **Analytics**: Google Analytics, Plausible

## Future Enhancements

1. **Secure legacy public message endpoints**: protect or remove `/api/messages`
2. **Persist contact submissions**: write accepted contact payloads to DB/queue
3. **Image CDN**: Cloudinary or similar
4. **Caching Layer**: Redis for API responses
5. **SSG**: Static generation for blog posts
6. **ISR**: Incremental Static Regeneration
7. **PWA**: Progressive Web App features
8. **Database Migration**: PostgreSQL for production scale

## Technology Rationale

### Next.js 16
- Latest features: App Router, Server Components
- Performance: Automatic code splitting, optimization
- SEO: Server-side rendering, meta tags
- Developer Experience: Fast refresh, TypeScript support

### TypeScript
- Type Safety: Catch errors at compile time
- Developer Experience: Better IDE support
- Maintainability: Self-documenting code
- Scalability: Easier refactoring

### Tailwind CSS
- Utility-First: Rapid development
- Small Bundle: Only used styles
- Customization: Easy to extend
- Consistency: Design tokens

### shadcn/ui
- Accessible: WCAG AA compliant
- Customizable: Easy to theme
- Modern: Built with Radix UI
- Typescript: Full type safety

### Prisma
- Type-Safe: Generated types
- Developer Experience: Great DX
- Performance: Optimized queries
- Flexibility: Multiple database support
