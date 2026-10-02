import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('loads the foundation map without serious accessibility violations', async ({
  page,
}) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: /where will your curiosity lead/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: /quest navigation/i }),
  ).toBeVisible()

  const accessibilityScan = await new AxeBuilder({ page }).analyze()

  const seriousViolations = accessibilityScan.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  )

  expect(seriousViolations).toEqual([])
  expect(pageErrors).toEqual([])
})

test('supports hash navigation and a visible keyboard focus indicator', async ({
  page,
}) => {
  await page.goto('/#/words')

  await expect(page.getByRole('heading', { name: /my words/i })).toBeVisible()

  const homeLink = page.getByRole('link', { name: 'Home', exact: true })
  await homeLink.focus()
  await expect(homeLink).toBeFocused()

  const focusStyle = await homeLink.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      color: style.outlineColor,
      style: style.outlineStyle,
      width: style.outlineWidth,
    }
  })

  expect(focusStyle.style).not.toBe('none')
  expect(focusStyle.width).not.toBe('0px')
})

test('completes the Be Open-Minded mission', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /continue/i }).click()

  await page.getByRole('button', { name: /let’s help them/i }).click()
  await page.getByRole('button', { name: /i understand/i }).click()
  await page.getByRole('button', { name: /try a choice/i }).click()
  await page.getByRole('button', { name: /explain their thinking/i }).click()
  await page.getByRole('button', { name: /keep exploring/i }).click()
  await page.getByRole('button', { name: /finish my mission/i }).click()

  await expect(
    page.getByRole('heading', { name: /open-minded stamp/i }),
  ).toBeVisible()
})
