import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('home page renders key sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('text=Portfolio').first()).toBeVisible()
    await expect(page.locator('section#contact')).toBeVisible()
  })

  test('persisted language updates document direction', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('language', 'en'))
    await page.reload()
    await expect.poll(async () => page.evaluate(() => document.documentElement.dir)).toBe('ltr')
    await page.evaluate(() => localStorage.setItem('language', 'fa'))
    await page.reload()
    await expect.poll(async () => page.evaluate(() => document.documentElement.dir)).toBe('rtl')
  })

  test('admin route redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.locator('text=Admin Login')).toBeVisible()
  })
})
