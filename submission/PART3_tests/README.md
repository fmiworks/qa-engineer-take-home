# Automated Testing Framework – Work Order Management

## Overview

The framework is built using **Playwright** and follows a **fixture-based architecture** to improve **reusability**, **maintainability**, and **scalability**.

---

## Architecture & Design

### Fixture-Based Architecture
- Role-based setup (`manager`, `worker`, `coordinator`, etc.)
- Avoids repeated login/role setup in each test
- Improves **reusability** and **test isolation**

### Page Object Model (POM) + Components
- `pages/` handle **page-specific actions**
- `components/` encapsulate **reusable UI behavior and assertions**
- Helps **separate concerns** and makes framework scalable

### Core Utilities
- `core/` contains **shared actions and assertions**
- Reduces duplication and keeps tests clean

### Constants & Locators
- Centralized dropdown options, locators, and static values
- Makes it easier to **update UI changes** without touching tests

### Test Naming & Traceability
- Every test has a **unique Test Case ID** `[TC-XXX]`
- Supports **traceability**, **execution reporting**, and **defect linking**

### Dynamic Test Data
- Randomized test data ensures uniqueness
- Avoids conflicts during parallel execution

### Using `test.step` and Logging
- **Step-wise execution** improves **readability**, **debugging**, and **reporting**.
- Each **logical action** within a test can be wrapped in `test.step`:
- Console logging within class methods provides visibility into test flow:
```ts
  async clickOnButton(buttonName: string): Promise<void> {
    await test.step(`Click On Button: "${buttonName}"`, async () => {
      const locatorElement = this.page.locator(CommonLocators.buttonLocator(buttonName));
      expect(locatorElement.first(), `The button "${buttonName}" is NOT visible`).toBeVisible();
      await locatorElement.first().click();
      console.log(`The button "${buttonName}" clicked`);
    });
  }
```
- This combination ensures each test is self-descriptive and easy to debug, especially for failing tests or flaky scenarios.

---

## Code Quality & Best Practices

### Key Features
- Fixture-based isolation prevents test interference. Each test gets its own setup and context.
- Page Object Model and component pattern improve maintainability
- Randomized test data ensures uniqueness
- Step-wise assertions improve readability and debugging (test.step)
- Console logging inside class methods improves traceability
- Test Case IDs improve traceability
- Parallel Execution Ready
- JSDoc usage in all class methods

---

## Folder Structure

```
work-order-tests/
│
├─ src/
│   ├─ pages/           # Page Objects
│   ├─ components/      # Reusable UI components
│   ├─ core/            # Shared actions & assertions
│   ├─ fixtures/        # Role / Work Order setup
│   ├─ constants/       # Dropdowns, statuses, etc.
│   ├─ utils/           # Helper functions
│   └─ locators/        # Common selectors
│
├─ tests/               # Test files only
├─ playwright.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## Test Coverage

- **Role-Based Testing:** Validates access permissions for Manager, Worker, Supplier, Coordinator, Stakeholder
- **Status Workflow Testing:** Covers full cycle `New Request → Under Consideration → Pending Quote → Scheduled → Work In Progress → Completed`. Additional statuses: `Cancelled`, `Delayed`
- **Table Validation:** Checks Work Order ID, Status, Priority, Description, Location
- **Cascading Dropdown Validation:** Verifies dropdown options based on current status
- **Negative Field Validation:** Ensures required fields validation, proper error message display, and blocked submissions

---

## Test Structure & Naming Convention

- Test Case ID format: `[TC-XXX] - Test Description`
- Enables traceability, execution reporting, and requirement mapping
- Example: `[TC-001] - Should Allow Manager To Cancel Work Order`

---

## Example Test

```ts
test('[TC-001] - Should Allow Manager To Cancel Work Order', async ({ managerWorkOrder }) => {
  const { workOrderId, actions, assertions } = managerWorkOrder;

  await actions.inputOnDialog('Test cancel by manager');
  await actions.clickOnButton('Cancel');

  await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ cancelled/);
  await assertions.assertTableCellValue(workOrderId, 'Status', 'Cancelled');
});
```

---

## Setup Instructions

1. **Clone Repository**

```bash
git clone <repo-url>
cd work-order-tests
```

2. **Install Dependencies**

```bash
npm install
```

3. **Install Playwright**

```bash
npx playwright install
```

4. **Run Tests**
- Note: NO need to run the app server manually

```bash
npx playwright test
```

5. **Run Specific Test File**

```bash
npx playwright test work-order-status-transitions.test.ts
```

---

## Test Execution Summary

- 11 Passed  
- 5 Failed  
- Duration: 15.3s

### Failed Tests

#### Regression Tests
## **Bug 1: Toast message "Work order created!" is displayed even has form error upon submittion**
- [TC-001] - Should Not Allow Submission With Missing Short Description Required Field  
- [TC-002] - Should Not Allow Submission With Missing Site Required Field  
- [TC-003] - Should Not Allow Submission With Missing Priority Required Field  
- [TC-004] - Should Not Allow Submission With Missing All Required Fields  

#### Smoke Tests
## **Bug 2: Cascading dropdown options incorrect during work order status transitions from "Under Consideration" to "Pending Quote"**
- [TC-012] - Should Verify Cascading Dropdown Options  





