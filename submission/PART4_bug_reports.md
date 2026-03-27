# Part 4: Bug Reports

## Bug 1: Invalid Create Submission Shows Success Toast

**Description**
- Submitting an empty Create Work Order form shows validation errors, but a success toast also appears.

**Steps to Reproduce**
1. Open the app as Coordinator.
2. Go to Create New tab.
3. Leave required fields empty.
4. Click Create Work Order.

**Expected Behavior**
- Validation errors are shown.
- No success toast appears.
- No work order is created.

**Actual Behavior**
- Validation errors are shown.
- A success toast appears: "Work order created!"

**Severity / Priority**
- Severity: High
- Priority: P1

**Screenshot**
- Recommended: capture form errors and success toast displayed at the same time.

---

## Bug 2: Manager Delete Performs Hard Delete Instead of Soft Delete

**Description**
- Deleting a work order as Manager removes it from the in-memory data collection instead of marking lifecycle state.

**Steps to Reproduce**
1. Open app as Manager.
2. Open any work order detail.
3. Click Delete Work Order.
4. Confirm deletion.

**Expected Behavior**
- Work order is soft deleted (lifecycle flag updated).
- Record remains in data store for audit/compliance.

**Actual Behavior**
- Work order is hard deleted (removed from collection).

**Severity / Priority**
- Severity: Critical
- Priority: P0

**Screenshot**
- Recommended: detail modal before delete and list/data state after delete.

---

## Bug 3: Stakeholder Can Access Create Work Order Tab

**Description**
- Stakeholder role can access Create New tab and create flow, which conflicts with expected restricted permissions.

**Steps to Reproduce**
1. Open app.
2. Switch role to Stakeholder.
3. Observe tab bar and Create New access.

**Expected Behavior**
- Stakeholder should not have create access.
- Create New tab should be hidden or disabled.

**Actual Behavior**
- Create New tab is available for Stakeholder.

**Severity / Priority**
- Severity: High
- Priority: P1

**Screenshot**
- Recommended: Stakeholder selected with Create New tab visible.

---

## Bug 4: Location Hierarchy Not Enforced During Creation

**Description**
- Create flow allows submission with only Site selected; Building/Floor/Room are not required.

**Steps to Reproduce**
1. Open app as Coordinator.
2. Go to Create New.
3. Fill Short Description, Site, and Priority only.
4. Leave Building/Floor/Room blank.
5. Submit form.

**Expected Behavior**
- Form should block submission unless full location path is provided (Site -> Building -> Floor -> Room).

**Actual Behavior**
- Work order is created without complete hierarchy.

**Severity / Priority**
- Severity: High
- Priority: P1

**Screenshot**
- Recommended: submitted record showing partial location only.

---

## Bug 5: Workflow Allows Skipping Required Status Step

**Description**
- Work order can move from Under Consideration directly to Scheduled, skipping Pending Quote.

**Steps to Reproduce**
1. Open app as Coordinator.
2. Move WO-2026-004816 from New Request to Under Consideration.
3. Open status dropdown again for same work order.
4. Select Scheduled directly.

**Expected Behavior**
- Workflow should enforce defined sequence:
	New Request -> Under Consideration -> Pending Quote -> Scheduled -> Work In Progress -> Completed.

**Actual Behavior**
- Direct transition to Scheduled is allowed from Under Consideration.

**Severity / Priority**
- Severity: Critical
- Priority: P0

**Screenshot**
- Recommended: status dropdown showing Scheduled available from Under Consideration.
