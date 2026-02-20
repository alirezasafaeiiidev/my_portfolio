import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('fa home has no critical accessibility violations', async ({ page }) => {
  await page.goto('/fa/')
  const results = await new AxeBuilder({ page }).analyze()
  const criticalViolations = results.violations.filter((violation) => violation.impact === 'critical')
  expect(criticalViolations).toEqual([])
})

test('fa qualification has no critical accessibility violations', async ({ page }) => {
  await page.goto('/fa/qualification')
  const results = await new AxeBuilder({ page }).analyze()
  const criticalViolations = results.violations.filter((violation) => violation.impact === 'critical')
  expect(criticalViolations).toEqual([])
})
