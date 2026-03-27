# Part 2: Additional Test Coverage Plan

## Coverage Strategy

Prioritize tests by business risk and compliance impact.

- `P0` High risk: workflow integrity, permissions, auditability, destructive actions.
- `P1` Medium risk: creation validation, assignment behavior, filter correctness.
- `P2` Lower risk: UX polish and resilience scenarios.

Use a balanced mix of:
- Positive path checks
- Negative and edge-case checks
- Role-based behavior checks
- Data integrity checks

## Area 1: Work Order Creation

### P0
1. Required field validation matrix
    - Verify each required field blocks submission when missing.
    - Verify combined missing fields show all relevant errors.

2. Full location hierarchy enforcement (Site -> Building -> Floor -> Room)
    - Submission blocked unless all levels are valid.
    - Child dropdown values update based on parent selection.
    - Changing parent clears invalid child selections.

### P1
3. Boundary and input quality checks
    - Very long descriptions, special characters, whitespace-only values.
    - Duplicate or near-duplicate submissions.

4. Creation permissions by role
    - Stakeholder, Works User, Supplier cannot create if not allowed.
    - Coordinator/Manager behavior validated against expected permissions.

## Area 2: Status Transitions

### P0
1. Transition matrix (allowed vs blocked)
    - Cover `New Request -> Under Consideration -> Pending Quote -> Scheduled -> Work In Progress -> Completed`.
    - Validate that out-of-order transitions are rejected.
    - Include side paths for `Cancelled` and `Delayed`.

2. Completion control requirements
    - Completing without action taken is blocked.
    - Completing with valid action taken succeeds.

3. Role-based transition authorization
    - Only permitted roles can transition status.
    - Unauthorized users cannot transition even if UI is manipulated.

### P1
4. Concurrency-style behavior
    - Attempt rapid sequential status changes and verify final state consistency.

## Area 3: Assignment (Supplier vs Employee)

### P0
1. Assignment type integrity
    - Assign to employee and supplier paths separately.
    - Ensure assignment UI/state reflects the chosen type correctly.

2. Permission and status gating for assignment
    - Validate who can assign and at what status stages.

### P1
3. Reassignment behavior
    - Reassign employee to supplier and vice versa with audit evidence.

## Area 4: Role-Based Access Control (RBAC)

### P0
1. Role-permission matrix coverage
    - Roles: Coordinator, Manager, Stakeholder, Works User, Supplier.
    - Actions: create, edit, transition, cancel, assign, view detail, filter/search.

2. Enforcement checks, not only visibility checks
    - Verify prohibited actions fail and do not mutate data.

### P1
3. Role switch session consistency
    - Switching role updates visible controls and allowed actions immediately.

## Area 5: Data Integrity and Compliance

### P0
1. Audit trail completeness
    - Every status change creates a new audit entry.
    - Validate actor, old/new status, timestamp, and action details where required.

2. Soft delete lifecycle behavior
    - Cancel/delete action must set lifecycle flag, not remove data permanently.
    - Soft-deleted records behave correctly in list/detail/filter views.

3. Identifier exposure rules
    - External references use UUID-style identifiers.
    - Internal numeric IDs are never displayed in user-facing UI.

### P1
4. Data consistency after failed actions
    - Failed transition/assignment attempts must not partially update state.

## Area 6: Filtering, Search, and List Behavior

### P1
1. Filter correctness by criterion
    - Status, priority, and search filters return only matching rows.
    - Validate each row, not just row count.

2. Combined filter behavior
    - Search + status + priority combinations.
    - Reset/clear filter behavior restores expected list.

3. Edge states
    - No-result scenarios, case sensitivity, partial matches, whitespace input.

## Area 7: Modal and Detail UX Behavior

### P1
1. Modal reliability
    - Open by row click, close by X, close by overlay/ESC if supported.
    - Reopen behavior should show correct record each time.

2. Detail fidelity
    - Detail view shows accurate status, location, assignment, and audit data.

### P2
3. Focus and accessibility basics
    - Focus trap and keyboard navigation in modal where applicable.
