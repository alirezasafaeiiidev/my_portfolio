import fs from 'node:fs'

const systemChromePath = '/usr/bin/google-chrome'
const disableWebServer = process.env.PLAYWRIGHT_DISABLE_WEBSERVER === 'true'
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3100',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    launchOptions,
  },
  webServer: disableWebServer
    ? undefined
    : {
        command: "bash -lc 'fuser -k 3100/tcp >/dev/null 2>&1 || true; pnpm run build && PORT=3100 pnpm run start'",
        url: 'http://127.0.0.1:3100',
        reuseExistingServer: true,
        timeout: 240_000,
      },
}

export default config
