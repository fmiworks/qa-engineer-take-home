# Part 1 - Common Issues in Test Suite (Playwright)

---

## Test suites contain significant issues that compromise test reliability, maintainability, and coverage. The primary concerns include:

1. Wrong assertion for the success message
2. Heavy reliance on hard-coded timeouts (flakiness)
3. Brittle selectors and hardcoded test data
4. Unnecessary assertions instead target elements
5. Duplication of code for reusable functions
6. Framework standard like POM
7. Test Data such as JSON, CSV, etc.
8. More standard reports like Allure
9. Proper screenshot and video for failures
10. Hooks and Environment File for App URL, Credentials, Environment like QA, Stage, Dev, etc.

---

## 1) Wrong assertion for the success message

**Issue:** Weak Toast Message Assertion Using 'toContainText'

**Location:** Line 30

**Code:**
await expect(page.locator('#toast')).toContainText('created');
```
```
**What the problem is:**

The assertion uses `toContainText('created')` which only checks if the word "created" appears anywhere in the toast message. This is too vague and will pass for ANY text containing "created":
- "Work order created successfully" (correct)
- "User created"  (false positive - wrong message)
- "recreated"  (false positive - substring match)

**Why it matters:**

Test passes even when the wrong success message is displayed and doesn't validate the actual user-facing message text.

**What I would do differently:**

```
```
**Option 1:** Assert exact text

const match = largestwordordernumber.match(/\d+$/);
const currentNumber = parseInt(match[0], 10);
const nextNumber = currentNumber + 1;
const nextWorkOrder = `WO-2026-${String(nextNumber).padStart(6, '0')}`;
await expect(toast).toHaveText(`Work order ${nextWorkOrder} successfully`);
```
```
**Option 2:** Assert exact text with visibility check

const toast = page.locator('#toast');
await expect(toast).toBeVisible({ timeout: 5000 });
await expect(toast).toHaveText('Work order created successfully');
```
```
**Option 3:** Use regex for exact match with trimming

const toastText = await page.locator('#toast').textContent();
expect(toastText.trim()).toBe('Work order created successfully');
```

---
```
## 2) Heavy reliance on hard-coded timeouts (flakiness)

**Issue:** Hard-coded timeouts using `page.waitForTimeout()`

**Location:** Line 18

**Code:**

async createWorkOrder(description, site, priority) {
  await this.page.locator('[data-tab="create"]').click();
  await this.page.locator('#shortDesc').fill(description);
  await this.page.locator('#site').selectOption(site);
  await this.page.locator('#priority').selectOption(priority);
  await this.page.locator('[data-testid="btn-create-submit"]').click();
  await this.page.waitForTimeout(1000);  //Line 18: Hard-coded timeout
}
```
```
**What the problem is:**

A fixed 1-second wait is used after submitting a work order creation form. This is an arbitrary delay that doesn't wait for any specific application state. The test blindly waits regardless of whether the operation completes in 100ms or needs 1500ms.

**Why it matters:**

If the application is slow (CI environment, network latency, heavy load), the operation might take longer than 1000ms, causing subsequent assertions to fail intermittently. Tests may pass locally but fail in CI/CD pipelines due to different performance characteristics.

**Wasted Time:** If the operation completes in 200ms, the test still waits the full 1000ms unnecessarily. Multiplied across test runs, this adds significant overhead.

**What I would do differently:**

Wait for specific element state changes

test('should transition New Request to Under Consideration', async ({ page }) => {
  await loginPage.selectRole('coordinator');

  const row = page.locator('#woTableBody tr').nth(1);
  await row.locator('.action-status').selectOption('Under Consideration');

  await expect(row.locator('.status-badge')).toContainText('Under Consideration', { timeout: 10000 });
});
```
```

---

## 3) Brittle selectors

**Issue:** Position-based selector using `.nth(1)`

**Location:** Line 56 and 59

**Code:**

test('should transition New Request to Under Consideration', async ({ page }) => {
  await loginPage.selectRole('coordinator');

  await page.locator('#woTableBody tr').nth(1).locator('.action-status').selectOption('Under Consideration');  //  Line 56

  await page.waitForTimeout(500);
  await expect(page.locator('#woTableBody tr').nth(1).locator('.status-badge')).toContainText('Under Consideration');  // Line 59
});
```
```
**What the problem is:**

Uses `.nth(1)` to select the second row in the table based on its position. Assumes the table always has the same order and the target work order is always at index 1. No identification of which specific work order is being tested.

**Why it matters:**

If the table sorting changes, the test will operate on the wrong row. If new work orders are added before this test runs, the row at index 1 will be different. If filters are applied or data changes, the assumption breaks.

**Missing Coverage:**

Doesn't test the actual business logic of finding and updating a specific work order. Brittle to any UI changes in table rendering order.

**What I would do differently:**

Select by Work Order ID using data-testid or specific attributes

test('should transition New Request to Under Consideration', async ({ page }) => {
  await loginPage.selectRole('coordinator');

  const workOrderRow = page.locator('[data-testid="wo-row-WO-2026-004816"]');
  await workOrderRow.locator('[data-testid="action-status"]').selectOption('Under Consideration');

  await expect(workOrderRow.locator('[data-testid="status-badge"]')).toContainText('Under Consideration');
});
```

---
```
## 4) Unnecessary assertions instead target elements

**Issue:** Unnecessary assertions instead target element

**Location:** Line 123

**Code:**

test('should open detail modal', async ({ page }) => {
  await loginPage.selectRole('coordinator');

  await page.locator('.wo-link').first().click();

  await expect(page.locator('#detailOverlay')).toHaveClass(/active/);
  await expect(page.locator('#detailTitle')).not.toBeEmpty();
});
```
```
**What the problem is:**

Applied the assertion on the wrong element instead of the target one. Checking the overlay class when we really only care about the detail title.

**Why it matters:**

It added number of unnecessary lines of code in the framework, also it delays the execution as well.

**What I would do differently:**

Apply assertion on target element which really need to validate.

test('should open detail modal', async ({ page }) => {
  await loginPage.selectRole('coordinator');

  await page.locator('.wo-link').first().click();
  await expect(page.locator('#detailTitle')).not.toBeEmpty();
});
```
```
---

## 5) Duplication of code for reusable functions

**Issue:** Duplicate helper functions across multiple test files

**Location:** workorder.spec.js and other test files

**Code:**

async function login(page, role) {
  await page.goto(BASE_URL);
  await page.locator('#roleSelect').selectOption(role);
}

async function createWorkOrder(page, description, site, priority) {
  await page.locator('[data-tab="create"]').click();
  await page.locator('#shortDesc').fill(description);
  await page.locator('#site').selectOption(site);
  await page.locator('#priority').selectOption(priority);
  await page.locator('[data-testid="btn-create-submit"]').click();
  await page.waitForTimeout(1000);
}
```
```
**What the problem is:**

The same helper functions are defined in multiple test files. This creates code duplication and maintenance overhead. Both implementations are identical (same logic, same parameters).

**Why it matters:**

When logic needs to change, must update in multiple places. Inconsistent implementations can lead to flaky tests. Violates DRY (Don't Repeat Yourself) principle.

**Missing Coverage:**

Unclear which function definition is actually being used. Hard to track which tests depend on which version. Difficult to debug when the function behavior is unexpected.

**Maintenance Issues:**
- Violates DRY (Don't Repeat Yourself) principle
- Confusing for developers: which file should contain the function?
- Increases cognitive load when reading test code

**What I would do differently:**

Create reusable fixtures or helper utilities

**File: tests/fixtures/auth.fixture.js**

import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL || 'http://localhost:3000');
    await use(page);
  }
});

export { expect } from '@playwright/test';
```
```
**File: tests/helpers/workorder.helper.js**

export class WorkOrderHelper {
  constructor(page) {
    this.page = page;
  }

  async login(role) {
    await this.page.goto(process.env.BASE_URL || 'http://localhost:3000');
    await this.page.locator('#roleSelect').selectOption(role);
  }

  async createWorkOrder(description, site, priority) {
    await this.page.locator('[data-tab="create"]').click();
    await this.page.locator('#shortDesc').fill(description);
    await this.page.locator('#site').selectOption(site);
    await this.page.locator('#priority').selectOption(priority);
    await this.page.locator('[data-testid="btn-create-submit"]').click();
    await this.page.locator('#toast').waitFor({ state: 'visible' });
  }
}
```
```
**Usage in test file:**

import { test, expect } from '@playwright/test';
import { WorkOrderHelper } from './helpers/workorder.helper';

test('should create work order', async ({ page }) => {
  const helper = new WorkOrderHelper(page);
  await helper.login('coordinator');
  await helper.createWorkOrder('Test', 'site-1', 'High');
});
```

---
```
## 6) Framework standard like POM

**Issue:** Direct selector usage scattered throughout tests

**Location:** Line 30-139

**Code:**

await expect(page.locator('#toast')).toContainText('created');

await expect(page.locator('#woTableBody tr').last()).toContainText('Test broken light');

await page.locator('.wo-link').first().click();
await page.locator('#detailClose').click();
await expect(page.locator('#detailOverlay')).not.toHaveClass(/active/);
```
```
**What the problem is:**

- **No abstraction layer:** All selectors are directly embedded in test code
- **No encapsulation:** Page structure and element locations are exposed throughout tests
- **No reusability:** Same selectors repeated multiple times across different tests
- **No single source of truth:** If a selector changes, must update in multiple places

**Why it matters:**

When UI changes, selectors break in multiple places simultaneously. Hard to identify which tests are affected by a UI change. No centralized place to update selectors when HTML structure changes. Increases likelihood of missing updates when refactoring.

**Maintenance Issues:**
- Every UI change requires updating multiple test files, extremely time-consuming to maintain as application grows
- New team members struggle to understand page structure
- No clear separation between "what to test" and "how to interact with page"
- Tests become unreadable with complex selector chains

**What I would do differently:**

Create separate Page Object classes that encapsulate page structure and interactions:

**Example:**

export class WorkOrderPage {
  constructor(page) {
    this.page = page;
    this.createTab = page.locator('[data-testid="tab-create"]');
    this.shortDescInput = page.locator('[data-testid="input-short-description"]');
    this.siteSelect = page.locator('[data-testid="select-site"]');
    this.prioritySelect = page.locator('[data-testid="select-priority"]');
    this.submitButton = page.locator('[data-testid="btn-create-submit"]');
    this.toast = page.locator('#toast');
  }

  async navigateToCreateTab() {
    await this.createTab.click();
    return this;
  }

  async fillWorkOrderForm(description, site, priority) {
    await this.shortDescInput.fill(description);
    await this.siteSelect.selectOption(site);
    await this.prioritySelect.selectOption(priority);
    return this;
  }

  async submitForm() {
    await this.submitButton.click();
    return this;
  }

  async verifyToastMessage(message) {
    await expect(this.toast).toContainText(message);
    return this;
  }
}
```
```
**And that we use in test:**

import { test, expect } from '@playwright/test';
import { WorkOrderPage } from './pages/workorder.page';
import testData from './fixtures/workorders.json';

test('should create a work order with valid data', async ({ page }) => {
  const workOrderPage = new WorkOrderPage(page);
  const { description, site, priority } = testData.valid;

  await workOrderPage
    .navigateToCreateTab()
    .fillWorkOrderForm(description, site, priority)
    .submitForm()
    .verifyToastMessage('created');
});
```

---
```
## 7) Hardcoded test data, Test Data such as JSON, CSV, etc

**Issue:** Hardcoded test data

**Location:** Line 26, 37, 45, 54, 63, 79, 86, 93, 104, 109, 119, 128, 135

**Code:**

await loginPage.selectRole('coordinator');

await loginPage.selectRole('works-user');

await workOrderPage.createWorkOrder('Test broken light', 'site-1', 'High');
```
```
**What the problem is:**

User roles are hard-coded as strings directly in test code. No centralized test data for user roles. Magic strings repeated throughout tests and no external data source (JSON/CSV).

**Why it matters:**

No data-driven testing for role-based scenarios. Hard to test edge cases with multiple roles.

**Maintenance Issues:**
- Must update role names in 13+ locations if they change
- No single source of truth for test users
- Difficult to manage test user credentials

**What I would do differently:**

Use JSON fixtures for test data:

**File: tests/fixtures/users.json**

```json
{
  "coordinator": {
    "role": "coordinator",
    "permissions": ["create", "view", "update"]
  },
  "manager": {
    "role": "manager",
    "permissions": ["create", "view", "update", "cancel"]
  },
  "worksUser": {
    "role": "works-user",
    "permissions": ["view"]
  }
}
```

**File: tests/fixtures/workorders.json**

```json
{
  "valid": {
    "description": "Test broken light",
    "site": "site-1",
    "priority": "High"
  },
  "urgent": {
    "description": "Emergency repair",
    "site": "site-2",
    "priority": "Critical"
  }
}
```

**File: tests/workorder.spec.js**

import { test, expect } from '@playwright/test';
import { WorkOrderPage } from './pages/workorder.page';
import users from './fixtures/users.json';
import workorders from './fixtures/workorders.json';

test.describe('Work Order Creation', () => {
  let workOrderPage;

  test.beforeEach(async ({ page }) => {
    workOrderPage = new WorkOrderPage(page);
    await page.goto('/');
  });

  test('should create a work order with valid data', async ({ page }) => {
    await workOrderPage.selectRole(users.coordinator.role);
    await workOrderPage.createWorkOrder(
      workorders.valid.description,
      workorders.valid.site,
      workorders.valid.priority
    );
  });

  test('should create urgent work order', async ({ page }) => {
    await workOrderPage.selectRole(users.manager.role);
    await workOrderPage.createWorkOrder(
      workorders.urgent.description,
      workorders.urgent.site,
      workorders.urgent.priority
    );
  });
});
```
```
**For CSV data-driven testing:**

import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import fs from 'fs';

const records = parse(fs.readFileSync('tests/fixtures/workorders.csv'), {
  columns: true,
  skip_empty_lines: true
});

for (const record of records) {
  test(`should create work order: ${record.description}`, async ({ page }) => {
    const workOrderPage = new WorkOrderPage(page);
    await workOrderPage.selectRole(record.role);
    await workOrderPage.createWorkOrder(record.description, record.site, record.priority);
  });
}
```
```
---

## 8) More standard reports like Allure

**Issue:** No custom reporter configured

**Location:** playwright.config.js and package.json

**Code:**

**File: playwright.config.js**

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

**File: package.json**

"devDependencies": {
  "@playwright/test": "^1.42.0",
  "typescript": "^5.3.0"
}
```

**What the problem is:**

- No custom reporter configured in Playwright config, Using default Playwright reporter only
- No reporter packages installed (no Allure, HTML reporter, etc.)
- No enhanced HTML report generation

**Why it matters:**

Hard to identify flaky tests: No historical data to show intermittent failures
- No retry tracking: Cannot see which tests needed retries
- No failure patterns: Difficult to spot recurring issues
- Limited visual test reports: Only basic terminal output available
- No test history: Can't track test trends over time

**What I would do differently:**

Implement Allure Reporter (Recommended)

Install Allure dependencies:

```bash
npm install --save-dev allure-playwright allure-commandline
```

**File: playwright.config.js**

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
      categories: [
        {
          name: 'Flaky tests',
          matchedStatuses: ['flaky']
        },
        {
          name: 'Failed tests',
          matchedStatuses: ['failed']
        }
      ],
      environmentInfo: {
        framework: 'Playwright',
        node_version: process.version,
      }
    }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  retries: process.env.CI ? 2 : 0,
});
```
```
**File: package.json - Add scripts**

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "allure:serve": "allure serve allure-results",
    "test:allure": "npm run test && npm run allure:generate && npm run allure:open",
    "report:html": "playwright show-report",
    "serve": "npx serve app -p 3000"
  }
}
```

**Usage in tests with Allure annotations:**

import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test('should create work order', async ({ page }) => {
  await allure.epic('Work Orders');
  await allure.feature('Work Order Creation');
  await allure.story('Create new work order');
  await allure.severity('critical');

  await allure.step('Navigate to create tab', async () => {
    await page.locator('[data-tab="create"]').click();
  });

  await allure.step('Fill work order form', async () => {
    await page.locator('#shortDesc').fill('Test');
  });
});
```
```
---

## 9) Proper screenshot and video for failures

**Issue:** No screenshot and video configuration

**Location:** playwright.config.js

**Code:**

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```
```
**What the problem is:**

- No explicit screenshot and video configuration in `playwright.config.js`
- Using Playwright defaults (screenshots only on failure)
- No custom screenshot/video folder configuration
- No trace configuration for debugging

**Why it matters:**

Without screenshots and videos, we cannot see the exact state when the test failed and cannot determine if the failure was due to timing, rendering, or an actual bug. Cannot confirm test ran against correct page/state.

**What I would do differently:**

Configure Screenshots, Videos, and Traces Properly

**File: playwright.config.js**

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  use: {
    baseURL: 'http://localhost:3000',

    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },

    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 }
    },

    trace: 'retain-on-failure',

    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  outputDir: 'test-results/',

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
    },
  ],
});
```
```
**Custom screenshot capture in tests:**

import { test, expect } from '@playwright/test';

test('should create work order', async ({ page }) => {
  await page.goto('/');

  await page.screenshot({
    path: 'screenshots/before-create.png',
    fullPage: true
  });

  await page.locator('[data-tab="create"]').click();

  await page.screenshot({
    path: 'screenshots/create-tab.png'
  });

  try {
    await page.locator('#shortDesc').fill('Test');
  } catch (error) {
    await page.screenshot({
      path: 'screenshots/error-state.png',
      fullPage: true
    });
    throw error;
  }
});
```
```
**Attach screenshots to Allure reports:**

import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test('should create work order', async ({ page }) => {
  await page.goto('/');

  const screenshot = await page.screenshot({ fullPage: true });
  await allure.attachment('Page Screenshot', screenshot, 'image/png');

  await page.locator('[data-tab="create"]').click();

  const elementScreenshot = await page.locator('#shortDesc').screenshot();
  await allure.attachment('Input Field', elementScreenshot, 'image/png');
});
```
```
**View traces for debugging:**

```bash
npx playwright show-trace test-results/trace.zip
```

---

## 10) Hooks and Environment File for App URL, Credentials, Environment like QA, Stage, Dev, etc.

**Issue:** Hard-coded Base URL in Multiple Files

**Location:**
- `workorder.spec.js:3` - `const BASE_URL = 'http://localhost:3000';`
- `playwright.config.js:5` - `baseURL: 'http://localhost:3000'`

**What the problem is:**

The application URL is hard-coded in multiple locations. There's no environment-based configuration to switch between QA, Staging, Dev, or Production environments. The URL is duplicated across test files and config, creating maintenance overhead.

**Why it matters:**

- Environment Inflexibility: Cannot run tests against different environments (QA, Stage, Prod) without code changes
- Maintenance Overhead: URL changes require updates in multiple files
- CI/CD Pipeline Issues: Cannot parameterize test runs for different deployment environments

**What I would do differently:**

**File: .env.dev**

```env
BASE_URL=http://localhost:3000
API_URL=http://localhost:3001
ENVIRONMENT=dev
```

**File: .env.qa**

```env
BASE_URL=https://qa.example.com
API_URL=https://api-qa.example.com
ENVIRONMENT=qa
```

**File: .env.staging**

```env
BASE_URL=https://staging.example.com
API_URL=https://api-staging.example.com
ENVIRONMENT=staging
```

**File: .env.prod**

```env
BASE_URL=https://example.com
API_URL=https://api.example.com
ENVIRONMENT=prod
```

**File: playwright.config.js**

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.TEST_ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `.env.${environment}`) });

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],

  use: {
    baseURL: process.env.BASE_URL,

    extraHTTPHeaders: {
      'X-Environment': process.env.ENVIRONMENT,
    },

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```
```

**File: tests/config/environment.config.js**

export const config = {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  apiURL: process.env.API_URL || 'http://localhost:3001',
  environment: process.env.ENVIRONMENT || 'dev',

  timeouts: {
    default: 30000,
    navigation: 60000,
    api: 10000,
  },

  users: {
    coordinator: {
      role: 'coordinator',
    },
    manager: {
      role: 'manager',
    },
  },
};
```
```
**File: package.json - Add scripts**

{
  "scripts": {
    "test": "playwright test",
    "test:dev": "TEST_ENV=dev playwright test",
    "test:qa": "TEST_ENV=qa playwright test",
    "test:staging": "TEST_ENV=staging playwright test",
    "test:prod": "TEST_ENV=prod playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.42.0",
    "dotenv": "^16.0.0"
  }
}
```
```
**Usage in tests:**

import { test, expect } from '@playwright/test';
import { config } from './config/environment.config';

test('should create work order', async ({ page }) => {
  await page.goto('/');

  console.log(`Running on: ${config.environment}`);
  console.log(`Base URL: ${config.baseURL}`);

  await page.locator('#roleSelect').selectOption(config.users.coordinator.role);
});
```
```

**Using fixtures for environment-aware setup:**

import { test as base } from '@playwright/test';
import { config } from './config/environment.config';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto(config.baseURL);
    await use(page);
  },
});

export { expect } from '@playwright/test';
```
```
**Run tests against different environments:**

```bash
npm run test:dev
npm run test:qa
npm run test:staging

TEST_ENV=qa npx playwright test
TEST_ENV=staging npx playwright test --headed
```
