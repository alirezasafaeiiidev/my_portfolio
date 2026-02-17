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
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.locator('section#services')).toBeVisible()
    await expect(page.locator('a[href="/services/infrastructure-localization"]')).toBeVisible()
    await expect(page.locator('section#contact')).toBeVisible()
  })

  test('language switch sets english direction', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('language-switch-trigger').first().click()
    await page.getByTestId('language-option-en').first().click()
    await expect.poll(async () => page.evaluate(() => document.documentElement.dir)).toBe('ltr')

    // SSR pages should respect the cookie-driven language.
    await page.goto('/services')
    await expect(page.locator('h1')).toContainText('Services')
  })

  test('theme toggle switches to dark mode', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Toggle theme' }).click()
    await expect.poll(async () => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true)
  })

  test('admin route redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.locator('text=Admin Login')).toBeVisible()
  })

  test('qualification form submits and redirects to thank-you', async ({ page }) => {
    await page.route('**/api/leads', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Lead registered successfully' }),
      })
    })

    await page.goto('/qualification')

    await page.locator('#contactName').fill('Ali Safaei')
    await page.locator('#organizationName').fill('Industrial Co')
    await page.locator('#email').fill('lead-e2e@example.com')
    await page.locator('#phone').fill('09120000000')
    await page.locator('#teamSize').fill('12')
    await page.locator('#timeline').fill('30 days')
    await page.locator('#currentStack').fill('Next.js + PostgreSQL')
    await page.locator('#criticalRisk').fill('Deployment governance is missing and rollback drills are not practiced.')
    await page.locator('#notes').fill('Please contact by email.')

    await page.getByRole('button', { name: /درخواست ارزیابی ریسک زیرساخت/ }).click()
    await expect(page).toHaveURL(/\/thank-you\?source=lead/)
    await expect(page.locator('h1')).toContainText(/Thanks\. Your request is in\.|ممنون\. درخواست شما ثبت شد\./)
  })
})
