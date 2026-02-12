# Professional Portfolio Website

A production-ready, enterprise-grade portfolio website built with Next.js 16, TypeScript, and modern best practices.

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌟 Features

### Core Features
- ✅ **Responsive Design**: Mobile-first approach with bottom navigation for mobile devices
- ✅ **Dark/Light Mode**: System preference detection with manual toggle
- ✅ **Multi-language Support**: English and Persian (Farsi) with RTL support
- ✅ **SEO Optimized**: Structured data, meta tags, sitemap, robots.txt
- ✅ **Performance**: Image optimization, code splitting, lazy loading, Web Vitals monitoring

### Content Management
- ✅ **Portfolio Showcase**: Featured and regular projects with filtering and search
- ✅ **Skills Display**: Categorized skills with proficiency levels
- ✅ **Experience Timeline**: Work history and education
- ✅ **Blog System**: Article cards with read time, newsletter signup
- ✅ **Contact Form**: Validated form with rate limiting and spam protection

### Admin & Analytics
- ✅ **Admin Dashboard**: Content management interface
- ✅ **Contact Message Management**: View and manage submissions
- ✅ **Analytics**: Basic visitor metrics and engagement tracking

### Technical Excellence
- ✅ **Type Safety**: 100% TypeScript with strict mode
- ✅ **Testing**: Vitest with coverage reporting
- ✅ **Linting**: ESLint with zero warnings
- ✅ **Code Quality**: Clean architecture, SOLID principles
- ✅ **Security**: Input sanitization, rate limiting, XSS protection

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Animations**: Framer Motion, Tailwind CSS animations
- **Theme**: next-themes for dark mode
- **i18n**: Custom translation system with React Context

### Backend & Data
- **ORM**: Prisma with SQLite
- **API**: Next.js API Routes (Server Actions)
- **Validation**: Zod schema validation
- **Database**: SQLite (client: @prisma/client)

### DevTools & Quality
- **Package Manager**: Bun
- **Testing**: Vitest, Testing Library, jsdom
- **Linting**: ESLint 9 with Next.js config
- **Code Formatting**: Prettier with consistent rules
- **Git Hooks**: Husky for pre-commit hooks
- **CI/CD**: GitHub Actions for automated testing and deployment

### Performance & Security
- **Image Optimization**: Next.js Image component with AVIF/WebP
- **Code Splitting**: Automatic with dynamic imports
- **Rate Limiting**: Redis REST distributed mode with in-memory fallback
- **Security**: CSP headers, input sanitization, SQL injection prevention
- **Monitoring**: Web Vitals tracking (LCP, FID, CLS)

## 📋 Prerequisites

- Node.js 18+ or Bun 1.0+
- Git 2.23+
- A modern web browser (for development)

## 🛠️ Installation

### Clone the Repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### Install Dependencies
```bash
bun install
# or
npm install
# or
pnpm install
# or
yarn install
```

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Optional: Analytics (if using external service)
# NEXT_PUBLIC_GA_ID="your-analytics-id"
# NEXT_PUBLIC_ENABLE_ANALYTICS="false"

# Optional: Admin credentials
# ADMIN_USERNAME="admin"
# ADMIN_PASSWORD="your-secure-password"
# ADMIN_SESSION_SECRET="at-least-32-characters-secret"
# ADMIN_SESSION_MAX_AGE_SECONDS="28800"

# Optional: Redis-backed distributed rate limiting
# REDIS_REST_URL="https://<upstash-host>"
# REDIS_REST_TOKEN="<upstash-token>"
```

### Database Setup
```bash
# Generate Prisma Client
bun run db:generate

# Push schema to database
bun run db:push
```

## 🏃 Running the Project

### Development Mode
```bash
bun run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
# Create optimized production build
bun run build

# Start production server
bun run start
```

### Testing
```bash
# Run tests once
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage

# Run API integration tests
bun run test:integration

# Run smoke E2E tests (requires Playwright runtime)
bun run test:e2e:smoke
```

### Linting
```bash
# Check code quality
bun run lint

# Run enterprise verification pipeline
bun run verify
```

## 📁 Project Structure

```
my-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── contact/     # Contact form API
│   │   │   └── admin/       # Admin API routes
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   │
│   ├── components/            # React components
│   │   ├── admin/            # Admin components
│   │   ├── animations/        # Animation wrappers
│   │   ├── i18n/             # Internationalization
│   │   ├── layout/           # Layout components (Header, Footer)
│   │   ├── search/           # Search components
│   │   ├── sections/         # Page sections (Hero, Portfolio, etc.)
│   │   ├── seo/              # SEO components
│   │   ├── theme/            # Theme components
│   │   └── ui/               # shadcn/ui primitives
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-toast.ts       # Toast notifications
│   │   ├── use-mobile.ts      # Mobile detection
│   │   └── use-i18n.ts       # i18n hook (if exists)
│   │
│   ├── lib/                  # Utility libraries
│   │   ├── db.ts            # Prisma client
│   │   ├── i18n.ts          # Translations (en/fa)
│   │   ├── i18n-context.tsx # i18n provider
│   │   ├── seo.ts           # SEO utilities & schemas
│   │   ├── types/           # TypeScript types
│   │   ├── utils.ts         # General utilities
│   │   ├── validators.ts     # Input validators
│   │   ├── security.ts       # Security utilities
│   │   └── rate-limit.ts    # Rate limiting
│   │
│   └── __tests__/             # Test files
│       └── lib/             # Unit tests
│
├── prisma/
│   └── schema.prisma           # Database schema
│
├── public/                    # Static assets
│   ├── images/               # Project images
│   ├── icons/                # Favicons, app icons
│   └── manifest.json         # PWA manifest
│
├── docs/                     # Additional documentation
│   ├── api.md              # API documentation
│   ├── architecture.md       # System architecture
│   └── deployment.md        # Deployment guide
│
├── .github/
│   └── workflows/            # GitHub Actions CI/CD
│
├── vitest.config.ts          # Vitest configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts           # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

## 🧪 Database Schema

### Models
- **Project**: Portfolio projects with tags and metadata
- **Skill**: Technical skills with categories and proficiency
- **Experience**: Work experience and education timeline
- **BlogPost**: Blog articles with SEO fields
- **ContactMessage**: Contact form submissions

## 🔐 Security Features

- ✅ Input Sanitization: All user inputs are sanitized
- ✅ SQL Injection Prevention: Parameterized queries
- ✅ XSS Protection: Content sanitization and CSP headers
- ✅ Rate Limiting: 5 requests per 15 minutes window
- ✅ Email Validation: Regex-based validation
- ✅ CSRF Protection: Built-in Next.js protection
- ✅ Secure Headers: Content-Security-Policy, X-Frame-Options
- ✅ Environment Variables: Sensitive data in .env files

## 📊 Performance Optimization

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTFB** (Time to First Byte): < 600ms

### Optimization Techniques
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Font optimization with next/font
- Tree shaking with SWC minifier
- Lazy loading with Intersection Observer
- Memoization with React.memo and useMemo
- Virtual scrolling for long lists

## 🌍 Internationalization

Supported Languages:
- English (en) - Default, LTR
- Persian/Farsi (fa) - RTL support

Features:
- Automatic language detection (localStorage)
- RTL/LTR direction switching
- Translation context for easy access
- Language switcher in navigation
- SEO-friendly hreflang tags

## 🎨 Theming

### Color System
- Light mode: Clean white background with high contrast
- Dark mode: Dark background with comfortable contrast
- System preference detection
- Smooth theme transitions
- Persistent theme storage

## 🧪 API Documentation

### Public API

#### POST `/api/contact`
Send a message through the contact form.

**Request Body:**
```typescript
{
  name: string
  email: string
  subject?: string
  message: string
}
```

**Response:**
```typescript
{
  success: boolean
  message: string
}
```

**Rate Limit:**
- 5 requests per 15 minutes per email

### Admin API

Admin routes require either:
- `Authorization: Bearer <ADMIN_API_TOKEN>`
- Valid session cookie from `POST /api/admin/auth/login`

#### POST `/api/admin/auth/login`
Create admin session cookie (`asdev_admin_session`).

#### POST `/api/admin/auth/logout`
Clear admin session cookie.

#### GET `/api/admin/auth/session`
Check current admin authentication status.

#### GET `/api/admin/projects`
Get all projects.

#### POST `/api/admin/projects`
Create a new project.

#### GET `/api/admin/messages`
Get all contact messages.

#### DELETE `/api/admin/messages?id={id}`
Delete a specific message.

## 🧪 Testing

### Running Tests
```bash
# All tests
bun run test

# Watch mode
bun run test:watch

# Coverage report
bun run test:coverage
```

### Test Coverage Target: 80%
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## 📚 Documentation

- [Installation Guide](#installation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security](#security-features)
- [Performance](#performance-optimization)
- [Final Deployment Checklist (FA)](docs/audit/FINAL_DEPLOYMENT_TASKS_FA.md)
- [Server Pre-Deploy Checklist (FA)](docs/DEPLOY_SERVER_PRECHECK_FA.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow ESLint rules (zero warnings)
- Write tests for new features
- Update documentation
- Use TypeScript strict mode
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📞 Support

For questions, issues, or feature requests:
- Open an [issue](https://github.com/yourusername/portfolio/issues)
- Contact: [contact@example.com](mailto:contact@example.com)

---

**Built with ❤️ using Next.js and TypeScript**
# my_portfolio-
