import { expect, Page } from '@playwright/test';

export const BASE_URL = 'http://localhost:3000';

export async function loginAs(page: Page, role: 'coordinator' | 'manager' | 'stakeholder' | 'works-user' | 'supplier') {
  await page.goto(BASE_URL);
  await page.selectOption('[data-testid="role-select"]', role);
}

export function rowByWoNumber(page: Page, woNumber: string) {
  return page.locator(`[data-testid="wo-row-${woNumber}"]`);
}

export async function openDetailByWoNumber(page: Page, woNumber: string) {
  await page.click(`[data-testid="wo-link-${woNumber}"]`);
  await expect(page.locator('[data-testid="detail-overlay"]')).toHaveClass(/active/);
}
