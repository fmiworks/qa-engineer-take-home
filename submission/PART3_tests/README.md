
# Automated Testing Framework – Work Order Management

## Overview

The framework is built using **Playwright** and follows a **fixture-based architecture** to improve **reusability**, **maintainability**, and **scalability**.

---

## Folder Structure

```
work-order-tests/
│
├─ src/
│   ├─ pages/                 # Page Object Models
│   │   ├─ createWorkOrderPage.ts
│   │   ├─ workOrderPage.ts
│   │   └─ ...
│   │
│   ├─ components/            # UI Components (actions + assertions)
│   │   ├─ dropdownComponent.ts
│   │   ├─ modalComponent.ts
│   │   └─ ...
│   │
│   ├─ core/                  # Shared Playwright actions & assertions
│   │   ├─ commonUserActionsPage.ts
│   │   ├─ commonAssertionsPage.ts
│   │   └─ ...
│   │
│   ├─ fixtures/              # Playwright fixtures
│   │   ├─ roleFixtures.ts
│   │   └─ workOrderFixture.ts
│   │
│   ├─ constants/             # Static values
│   │   ├─ dropdownConstants.ts
│   │   └─ ...
│   │
│   ├─ utils/                 # Pure helper utilities
│   │   ├─ dateTimeUtils.ts
│   │   ├─ randomUtils.ts
│   │   └─ ...
│   │
│   └─ locators/              # Reusable locators
│       ├─ commonLocators.ts
│       └─ ...
│
├─ tests/                     # Test files only
│   ├─ ui-test/
│      ├─ smoke/
│      │   └─ work-order-status-transitions.test.ts
│      │
│      ├─ regression/
│          └─ create-order-form-validation.test.ts
│
├─ playwright.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## Test Coverage

### Role-Based Testing
Validates access permissions and actions for different user roles:
- Manager  
- Worker  
- Supplier  
- Coordinator  
- Stakeholder  

### Status Workflow Testing
Covers the full lifecycle of a work order:
- Creation  
- Assignment  
- In Progress  
- Completion  
- Cancellation  
- Closure  

### Table Validation
Validates that submitted work order data is correctly displayed in the table:
- Work Order ID, Status, Priority, Description    
- Location (Site, Building, Floor, Room)  

### Cascading Dropdown Validation
Verifies that **status dropdown options dynamically update** based on the current work order status.

### Negative Field Validation
Ensures:
- Required fields validation  
- Proper error message display  
- Form submission blocking  

---

## Test Structure & Naming Convention
Each test case follows a **tagging format** using a unique **Test Case ID**:

```
[TC-XXX] - Test Description
```

**Example:**
- `[TC-001] - Should Allow Manager To Cancel Work Order`  
 
Enables:
- Test case traceability  
- Execution reporting  
- Requirement mapping  
- Defect linking  


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

3. **Install Playwright Browsers**

```bash
npx playwright install
```

4. **Run Tests**

```bash
cd submission/PART3_tests
npx playwright test
```

5. **Run Specific Test File**

```bash
npx playwright test tests/work-order-status-transitions.test.ts
```

---

## Test Execution Summary - Current Status

### Result
- 11 Passed  
- 5 Failed  
- Duration: 15.3s  

### Failed Tests

#### Regression Tests
- [TC-001] - Should Not Allow Submission With Missing Short Description Required Field  
- [TC-002] - Should Not Allow Submission With Missing Site Required Field  
- [TC-003] - Should Not Allow Submission With Missing Priority Required Field  
- [TC-004] - Should Not Allow Submission With Missing All Required Fields  

#### Smoke Tests
- [TC-012] - Should Verify Cascading Dropdown Options  

### Notes
- Failures are related to **form validation** and **dropdown cascading behavior**
- Requires investigation on:
  - Required field validation handling
  - Cascading dropdown data loading

---
