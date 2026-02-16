import fs from 'node:fs'

const systemChromePath = '/usr/bin/google-chrome'
const launchOptions = fs.existsSync(systemChromePath)
  ? {
      executablePath: systemChromePath,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    }
  : undefined

const config = {
  testDir: './e2e',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    launchOptions,
  },
  webServer: {
    command: "bash -lc 'pnpm run build && pnpm run start'",
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 240_000,
  },
}

export default config
