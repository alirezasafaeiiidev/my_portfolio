# Contributing to Portfolio Website

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

### Our Pledge
- Be respectful and inclusive
- Provide constructive feedback
- Welcome newcomers and help them learn
- Focus on what is best for the community

### Our Standards
- Use welcoming and inclusive language
- Be respectful of different viewpoints
- Gracefully accept constructive criticism
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js 18+ or Bun 1.0+
- Git 2.23+
- Familiarity with TypeScript, React, Next.js
- Knowledge of testing frameworks (Vitest)

### Setup Development Environment

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. **Install dependencies**
```bash
bun install
```

3. **Start development server**
```bash
bun run dev
```

4. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Branch Naming Conventions

- **feature/**: New features (e.g., `feature/add-dark-mode`)
- **bugfix/**: Bug fixes (e.g., `bugfix/fix-navigation-error`)
- **hotfix/**: Critical bug fixes (e.g., `hotfix/security-vulnerability`)
- **refactor/**: Code refactoring (e.g., `refactor/optimize-performance`)
- **docs/**: Documentation updates (e.g., `docs/update-api-docs`)
- **test/**: Adding or updating tests (e.g., `test/add-coverage`)
- **chore/**: Maintenance tasks (e.g., `chore/update-dependencies`)
- **style/**: Code style changes (e.g., `style/format-code`)

### Commit Frequency
- Commit often with small, logical changes
- Keep PRs focused and manageable in size
- One feature or bugfix per PR is preferred

## Coding Standards

### TypeScript Guidelines

#### Type Safety
- Use strict TypeScript mode
- Avoid `any` type - use `unknown` when necessary
- Define interfaces for all data structures
- Use type guards for runtime type checking
- Leverage TypeScript's type inference

#### Example:
```typescript
// ❌ Bad
const getUser = async (id: any) => {
  return user
}

// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

const getUser = async (id: string): Promise<User> => {
  return user
}
```

### Code Style

#### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions/Variables**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`UserData`)
- **Files**: kebab-case (`user-profile.tsx`)

#### Best Practices
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names
- Avoid nested ternary operators
- Use early returns to reduce nesting
- Prefer `const` over `let` when possible
- DRY (Don't Repeat Yourself) - extract common logic
- Comment complex logic, not obvious code
- Use TypeScript's type system effectively

#### Example:
```typescript
// ❌ Bad
function d(p) { return p.n }

// ✅ Good
function getUserName(user: User): string {
  return user.name
}
```

### React Best Practices

#### Component Structure
- Functional components with hooks
- Props should have TypeScript interfaces
- Use proper key attributes in lists
- Memoize expensive computations
- Avoid inline styles - use Tailwind classes
- Keep components small and focused

#### Example:
```typescript
// ✅ Good Component Pattern
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-primary text-white rounded-lg"
    >
      {label}
    </button>
  )
}
```

### Performance Guidelines

#### Optimization Techniques
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load images and components
- Use dynamic imports for large libraries
- Optimize bundle size with tree shaking
- Use Next.js Image component for images
- Implement proper caching strategies

#### Example:
```typescript
// ✅ Lazy Import
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'))

// ✅ Memoization
const ExpensiveList = memo(({ items }) => {
  return items.map(...)
})
```

## Testing Guidelines

### Writing Tests

#### Test Structure
- Arrange, Act, Assert pattern
- One assertion per test when possible
- Descriptive test names
- Test edge cases and error conditions

#### Example:
```typescript
describe('Email Validation', () => {
  it('should validate correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })

  it('should reject invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false)
  })
})
```

### Coverage Requirements
- Minimum 80% coverage for new code
- 100% coverage for critical utilities
- Test all public APIs
- Include integration tests for user flows

### Running Tests
```bash
# Run all tests
bun run test

# Run in watch mode
bun run test:watch

# Generate coverage report
bun run test:coverage
```

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <subject>

<body>
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

### Examples
```
feat(contact): add rate limiting to contact form

fix(navigation): resolve mobile menu not closing issue

docs(readme): update installation instructions

style(formats): run prettier on all files

perf(images): implement lazy loading for project images

test(utilities): add coverage for validators

chore(deps): update next.js to v16.1.0
```

### Commit Body
- Use the body to explain the what and why
- Break paragraphs with blank lines
- Use bullet points for multiple items
- Reference issues and pull requests

## Pull Request Process

### Before Submitting
- [ ] Run tests: `bun run test`
- [ ] Run linter: `bun run lint`
- [ ] Update documentation if needed
- [ ] Add tests for new features
- [ ] Ensure no console errors
- [ ] Verify on mobile devices
- [ ] Test dark/light modes
- [ ] Test both languages (EN/FA)

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] All tests passing
- [ ] Code coverage maintained/improved
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review performed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process
1. Automated checks (lint, test) must pass
2. At least one reviewer approval required
3. Address all review comments before merging
4. Squash commits if necessary
5. Update CHANGELOG.md if needed

## Questions or Issues?

- Check [existing issues](https://github.com/yourusername/portfolio/issues)
- Start a [discussion](https://github.com/yourusername/portfolio/discussions)
- Contact maintainers at [contact@example.com](mailto:contact@example.com)

---

Thank you for contributing! 🙏
