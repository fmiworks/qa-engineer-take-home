import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// ========== HELPERS ==========

async function login(page: Page, role: string) {
  await page.goto(BASE_URL);
  await page.selectOption('#roleSelect', role);
}

async function createWorkOrder(page: Page, description: string, site: string, priority: string) {
  await page.click('[data-tab="create"]');
  await page.fill('#shortDesc', description);
  await page.selectOption('#site', site);
  await page.selectOption('#priority', priority);
  await page.click('[data-testid="btn-create-submit"]');
  await page.waitForTimeout(1000);
}

// ========== TESTS ==========

test.describe('Work Order Creation', () => {

  test('should create a work order with valid data', async ({ page }) => {
    await login(page, 'coordinator');
    await createWorkOrder(page, 'Test broken light', 'site-1', 'High');

    // Check we're back on the list tab
    await expect(page.locator('[data-tab="list"]')).toHaveClass(/active/);

    // Check the toast appeared
    await expect(page.locator('#toast')).toContainText('created');

    // Check the WO is in the table
    const rows = page.locator('#woTableBody tr');
    const lastRow = rows.last();
    await expect(lastRow).toContainText('Test broken light');
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await login(page, 'coordinator');
    await page.click('[data-tab="create"]');
    await page.click('[data-testid="btn-create-submit"]');

    // Check error messages appear
    const errors = page.locator('#formErrors');
    await expect(errors).toContainText('required');
  });

  test('should not allow stakeholder to see create tab', async ({ page }) => {
    await login(page, 'stakeholder');
    await expect(page.locator('[data-tab="create"]')).not.toBeVisible();
  });

});

test.describe('Status Transitions', () => {

  test('should transition from New Request to Under Consideration', async ({ page }) => {
    await login(page, 'coordinator');

    // Find the New Request WO
    const row = page.locator('tr', { has: page.locator('text=WO-2026-004816') });
    const select = row.locator('.action-status');
    await select.selectOption('Under Consideration');

    await page.waitForTimeout(500);

    // Check status updated
    await expect(row.locator('.status-badge')).toContainText('Under Consideration');
  });

  test('should require action taken when completing', async ({ page }) => {
    await login(page, 'coordinator');

    // Find the WIP work order and try to complete it
    const row = page.locator('tr', { has: page.locator('text=WO-2026-004815') });
    const select = row.locator('.action-status');

    // Set up dialog handler
    page.on('dialog', async dialog => {
      await dialog.accept('Replaced all fluorescent tubes');
    });

    await select.selectOption('Completed');
    await page.waitForTimeout(500);

    await expect(row.locator('.status-badge')).toContainText('Completed');
  });

});

test.describe('Filtering', () => {

  test('should filter by status', async ({ page }) => {
    await login(page, 'coordinator');

    await page.selectOption('#filterStatus', 'Completed');
    await page.waitForTimeout(300);

    const rows = page.locator('#woTableBody tr');
    const count = await rows.count();

    // All visible rows should be Completed
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).locator('.status-badge')).toContainText('Completed');
    }
  });

  test('should filter by search text', async ({ page }) => {
    await login(page, 'coordinator');

    await page.fill('#filterSearch', '004816');
    await page.waitForTimeout(300);

    const rows = page.locator('#woTableBody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('WO-2026-004816');
  });

});

test.describe('Role Permissions', () => {

  test('should show cancel button for manager', async ({ page }) => {
    await login(page, 'manager');

    // Manager should see cancel buttons
    const cancelButtons = page.locator('.action-cancel');
    await expect(cancelButtons.first()).toBeVisible();
  });

  test('should hide cancel button for coordinator', async ({ page }) => {
    await login(page, 'coordinator');

    // Coordinator cannot cancel
    const cancelButtons = page.locator('.action-cancel');
    await expect(cancelButtons).toHaveCount(0);
  });

});

test.describe('Work Order Detail', () => {

  test('should open detail modal on click', async ({ page }) => {
    await login(page, 'coordinator');

    await page.click('[data-testid="wo-link-WO-2026-004815"]');

    const overlay = page.locator('#detailOverlay');
    await expect(overlay).toHaveClass(/active/);
    await expect(page.locator('#detailTitle')).toContainText('WO-2026-004815');
  });

  test('should display audit log entries', async ({ page }) => {
    await login(page, 'coordinator');

    await page.click('[data-testid="wo-link-WO-2026-004815"]');

    const auditEntries = page.locator('.audit-entry');
    const count = await auditEntries.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should close modal when clicking X', async ({ page }) => {
    await login(page, 'coordinator');

    await page.click('[data-testid="wo-link-WO-2026-004815"]');
    await page.click('#detailClose');

    await expect(page.locator('#detailOverlay')).not.toHaveClass(/active/);
  });

});
