import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('skip link is keyboard reachable and targets main content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const focusedHref = await page.evaluate(() => {
      const active = document.activeElement
      return active instanceof HTMLAnchorElement ? active.getAttribute('href') : null
    })
    expect(focusedHref).toBe('#main-content')

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main-content$/)
  })

  test('home page renders key sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('text=Portfolio').first()).toBeVisible()
    await expect(page.locator('section#contact')).toBeVisible()
  })

  test('language switch sets english direction', async ({ page }) => {
    await page.goto('/')

    await page.locator('button:has(svg.lucide-languages)').first().click()
    await page.getByRole('menuitem', { name: /English|انگلیسی/ }).click()
    await expect.poll(async () => page.evaluate(() => document.documentElement.dir)).toBe('ltr')
  })

  test('admin route redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.locator('text=Admin Login')).toBeVisible()
  })
})
