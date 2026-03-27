# Part 3 Tests (Playwright)

This folder contains 4 high-priority tests selected from the Part 2 coverage plan.

## Files

- `workorder.high-priority.spec.ts`: high-risk creation integrity, workflow, validation, and data-integrity scenarios.
- `helpers.ts`: shared utility functions (`loginAs`, `rowByWoNumber`, `openDetailByWoNumber`).

## Covered Priority Scenarios

1. UI behavior: Location cascade enables/resets dependent dropdowns correctly.
2. RBAC: Works User cannot assign/cancel and only sees allowed row actions.
3. Audit trail: Full valid workflow preserves existing entries and appends all expected transition logs.
4. Completion control: Dismissing action-taken prompt does not complete the work order.

## Run

From repository root:

```bash
npm init -y
npm install -D @playwright/test
npx playwright install
npx serve app
npx playwright test submission/PART3_tests/workorder.high-priority.spec.ts
```

App URL used by tests: `http://localhost:3000`

## Notes

- These tests assert expected domain behavior.
- In the current app state, one or more tests are expected to fail because they are designed to expose planted defects.
