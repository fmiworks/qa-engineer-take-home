import { expect, test } from '@playwright/test';
import { loginAs, openDetailByWoNumber, rowByWoNumber } from './helpers';

test.describe('Part 3 - High Priority Work Order Tests', () => {
  test('UI behavior: location cascade enables and resets dependent dropdowns correctly', async ({ page }) => {
    await loginAs(page, 'coordinator');

    await page.click('[data-testid="tab-create"]');

    await expect(page.locator('[data-testid="select-building"]')).toBeDisabled();
    await expect(page.locator('[data-testid="select-floor"]')).toBeDisabled();
    await expect(page.locator('[data-testid="select-room"]')).toBeDisabled();

    await page.selectOption('[data-testid="select-site"]', 'site-1');
    await expect(page.locator('[data-testid="select-building"]')).toBeEnabled();

    await page.selectOption('[data-testid="select-building"]', 'bld-1');
    await expect(page.locator('[data-testid="select-floor"]')).toBeEnabled();

    await page.selectOption('[data-testid="select-floor"]', 'flr-1');
    await expect(page.locator('[data-testid="select-room"]')).toBeEnabled();
    await page.selectOption('[data-testid="select-room"]', 'rm-2');

    await page.selectOption('[data-testid="select-site"]', 'site-2');

    await expect(page.locator('[data-testid="select-building"]')).toBeEnabled();
    await expect(page.locator('[data-testid="select-floor"]')).toBeDisabled();
    await expect(page.locator('[data-testid="select-room"]')).toBeDisabled();
    await expect(page.locator('[data-testid="select-floor"]')).toHaveValue('');
    await expect(page.locator('[data-testid="select-room"]')).toHaveValue('');
  });

  test('RBAC: works-user should not see assign actions for a New Request', async ({ page }) => {
    await loginAs(page, 'works-user');

    const targetRow = rowByWoNumber(page, 'WO-2026-004816');
    await expect(targetRow).toBeVisible();

    await expect(targetRow.locator('.action-assign')).toHaveCount(0);
    await expect(targetRow.locator('.action-cancel')).toHaveCount(0);
    await expect(targetRow.locator('.action-status')).toHaveCount(1);
  });

  test('Audit trail: full valid workflow should append all expected status-change entries', async ({ page }) => {
    await loginAs(page, 'coordinator');

    await openDetailByWoNumber(page, 'WO-2026-004816');
    const beforeEntries = await page.locator('.audit-entry').allTextContents();
    await page.click('[data-testid="detail-close"]');

    const row = rowByWoNumber(page, 'WO-2026-004816');
    const transitions: Array<{ to: string; expectedLog: string; promptText?: string }> = [
      { to: 'Under Consideration', expectedLog: 'Status changed from New Request to Under Consideration' },
      { to: 'Pending Quote', expectedLog: 'Status changed from Under Consideration to Pending Quote' },
      { to: 'Scheduled', expectedLog: 'Status changed from Pending Quote to Scheduled' },
      { to: 'Work In Progress', expectedLog: 'Status changed from Scheduled to Work In Progress' },
      { to: 'Completed', expectedLog: 'Status changed from Work In Progress to Completed', promptText: 'Completed during full workflow audit test' }
    ];

    for (const step of transitions) {
      if (step.to === 'Completed') {
        page.once('dialog', async (dialog) => {
          await dialog.accept(step.promptText);
        });
      }

      await row.locator('.action-status').selectOption(step.to);
      await expect(row.locator('.status-badge')).toContainText(step.to);
    }

    await openDetailByWoNumber(page, 'WO-2026-004816');
    const afterEntries = await page.locator('.audit-entry').allTextContents();

    expect(afterEntries).toHaveLength(beforeEntries.length + transitions.length);

    for (let i = 0; i < beforeEntries.length; i++) {
      expect(afterEntries[i]).toBe(beforeEntries[i]);
    }

    for (let i = 0; i < transitions.length; i++) {
      const newEntry = afterEntries[beforeEntries.length + i];
      expect(newEntry).toContain(transitions[i].expectedLog);
      expect(newEntry).toContain('Sarah Chen');
    }
  });

  test('Completion control: should not complete when action taken prompt is dismissed', async ({ page }) => {
    await loginAs(page, 'coordinator');

    await openDetailByWoNumber(page, 'WO-2026-004815');
    const beforeCount = await page.locator('.audit-entry').count();
    await page.click('[data-testid="detail-close"]');

    const row = rowByWoNumber(page, 'WO-2026-004815');
    await expect(row.locator('.status-badge')).toContainText('Work In Progress');

    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await row.locator('.action-status').selectOption('Completed');
    await expect(row.locator('.status-badge')).toContainText('Work In Progress');

    await openDetailByWoNumber(page, 'WO-2026-004815');
    await expect(page.locator('.audit-entry')).toHaveCount(beforeCount);
    await expect(page.locator('[data-testid="audit-log"]')).not.toContainText('Status changed from Work In Progress to Completed');
  });
});
