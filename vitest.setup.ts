import '@testing-library/jest-dom/vitest'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined
    return {
      pass,
      message: () => (pass ? 'element is in document' : 'element is not in document'),
    }
  },
  toHaveClass(received, className) {
    const pass = received?.classList?.contains(className)
    return {
      pass,
      message: () => (pass ? `has class ${className}` : `does not have class ${className}`),
    }
  },
})
