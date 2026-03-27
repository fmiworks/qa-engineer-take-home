# Part 1: Existing Test Suite Review

Reviewed suites:
- tests/playwright/workorder.spec.ts
- tests/cypress/workorder.cy.js

## Findings

### 1. Missing coverage for key domain rules (missing coverage)
What the problem is:
- No direct tests for soft deletes, UUID exposure, supplier vs employee assignment, and full workflow governance.

Why it matters:
- High-risk business and compliance defects can ship undetected.

What I'd do differently:
- Add requirement-traceable tests for each rule with positive and negative scenarios.

### 2. Transition testing is incomplete (missing coverage)
What the problem is:
- Only a couple of status moves are tested; invalid transitions are not validated.

Why it matters:
- State-machine bugs can pass CI.

What I'd do differently:
- Add a status transition matrix covering allowed and blocked transitions, including Cancelled and Delayed.

### 3. "Action taken required" tests are misleading (incorrect assertion)
What the problem is:
- Tests titled as requirement checks only confirm status changes to Completed.

Why it matters:
- False confidence: requirement may be broken while tests still pass.

What I'd do differently:
- Add explicit negative test (empty action rejected) and positive test (valid action accepted).

### 4. Audit log checks are too shallow (incorrect assertion)
What the problem is:
- Tests only check that at least one audit entry exists.

Why it matters:
- Old entries can cause false positives; current action logging is not verified.

What I'd do differently:
- Assert audit entry count increments and validate content for actor, transition, and timestamp/details.

### 5. Role coverage is inconsistent between frameworks (poor practice + missing coverage)
What the problem is:
- Role checks differ across suites, and Supplier permissions are not covered.

Why it matters:
- Permission regressions can be missed; quality signal differs by framework.

What I'd do differently:
- Define one role-permission matrix and apply it consistently in both suites.

### 6. Permission tests focus on visibility, not enforcement (missing coverage)
What the problem is:
- Most checks only verify button visibility/non-visibility.

Why it matters:
- UI hiding does not guarantee unauthorized actions are blocked.

What I'd do differently:
- Add negative authorization tests that attempt prohibited actions and verify no state change.

### 7. Cypress completion dialog handling looks wrong (bug risk)
What the problem is:
- The dialog handler appears mismatched to the scenario intent and is registered after status selection.

Why it matters:
- Can create flaky behavior or false positives around completion flow.

What I'd do differently:
- Register dialog handling before triggering transition and validate the required user input path.

### 8. Static IDs and row indexes make tests fragile (fragile pattern)
What the problem is:
- Tests rely on seeded work order IDs and positional selectors (first/last/eq).

Why it matters:
- Small data/order changes produce noisy failures unrelated to real defects.

What I'd do differently:
- Use deterministic test records and stable, entity-scoped selectors.

### 9. Fixed waits are used heavily (poor practice)
What the problem is:
- Suites use hard-coded sleeps instead of waiting for specific state changes.

Why it matters:
- Flaky in slower environments and slower-than-needed in faster ones.

What I'd do differently:
- Wait for explicit outcomes (toast text, status badge update, modal state change).

### 10. Filter tests are weak (incorrect assertion)
What the problem is:
- Several tests validate only row counts, not row correctness.

Why it matters:
- Wrong rows can remain visible while tests still pass.

What I'd do differently:
- Assert each returned row matches active filter criteria and include zero-result cases.

### 11. Location hierarchy is not tested (missing coverage)
What the problem is:
- Site -> Building -> Floor -> Room dependency behavior is not validated.

Why it matters:
- Core creation flow defects can slip through.

What I'd do differently:
- Add cascading dependency tests and invalid hierarchy submission checks.

### 12. Test intent and title quality is inconsistent (poor practice)
What the problem is:
- Some test names claim stronger verification than assertions actually perform.

Why it matters:
- Coverage is easily overestimated during review/sign-off.

What I'd do differently:
- Keep test names tightly aligned to what is actually asserted.
