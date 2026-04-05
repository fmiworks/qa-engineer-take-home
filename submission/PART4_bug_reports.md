# Failed Test Report

---

## **Bug 1: Toast message "Work order created!" is displayed even has form error upon submittion**

**Affected Test Case IDs:** [TC-001], [TC-002], [TC-003], [TC-004]  
**Module:** Create Work Order Form  
**Environment:** QA / Local  
**Browser:** Chromium  
**Severity:** High  

**Description:**  
When submitting a work order with missing required fields (**Short Description, Site, or Priority**), the individual field validations appear correctly, but the toast message `"Work order created!"` does **not display**, causing test failures.

**Steps to Reproduce:**  
1. Open the Create Work Order form.  
2. Submit with:
   - Missing Short Description → [TC-001]  
   - Missing Site → [TC-002]  
   - Missing Priority → [TC-003]  
   - All required fields empty → [TC-004]  
3. Observe the form validation and toast messages.  

**Expected Result:**  
- Field-level errors should be displayed:  
  - "Short Description is required."  
  - "Site is required."  
  - "Priority is required."
- Toast message: `"Work order NOT created!"`

**Actual Result:**  
- Field-level errors **displayed correctly** 
- Toast message **missing / test fails**

**Evidence:**  
- Test logs for [TC-001] → [TC-004]  → [TC-004] (Automated Test Log)
- Screenshots showing field validations without toast  

---

## **Bug 2: Cascading dropdown options incorrect during work order status transitions from "Under Consideration" to "Pending Quote"**

**Affected Test Case ID:** [TC-012]  
**Module:** Work Order Status Page / Move to... Dropdown Option  
**Environment:** QA / Local  
**Browser:** Chromium  
**Severity:** High  

**Description:**  
The cascading of "Move to..." dropdown option list from "Under Consideration" to "Pending Quote" is incorrect that deviate the work order status workflow if wrong option is selected.   

**Steps to Reproduce:**  
1. Login as a manager or coordinator submit a work order  
2. Move the submitted work order from "New Request" to "Under Consideration"
3. Obsevre that the order status changed to "Under Consideration"
4. Click on the "Move to.." dropdown 
3. Observe available option lists.  

**Expected Result:**  
- The work order with status "Under Consideration" can only be move to "Pending Quote" and it is expected that "Move to..." dropdown option list should only be "Pending Quote".

**Actual Result:**  
- The "Move to..." dropdown option list has 2 options which are "Pending Quote" and "Scheduled" which enable the user to move the work order "Scheduled" status.

**Evidence:**  
- Logs for TC-012  → [TC-004] (Automated Test Log)
- Screenshots of dropdown options for each status step  

---


## **Bug 3: Work Order can be marked as Completed even when unassigned**

**Affected Test Case IDs:** [TC-003][TC-004][TC-005][TC-006][TC-007]  
**Module:** Work Order Status Workflow / Move to Completed  
**Environment:** QA / Local  
**Browser:** Chromium  
**Severity:** Critical  

**Description:**  
The system allows a work order to be moved to the "Completed" status even when no user is assigned to the task. This breaks the intended workflow and can lead to untracked or incomplete work being marked as finished.  

**Steps to Reproduce:**  
1. Login as a manager.  
2. Submit a new work order.  
3. Move the work order through the following statuses without assigning it to any user:  
   - Under Consideration → Pending Quote → Scheduled → Work In Progress → Completed  
4. Observe that the work order reaches "Completed" without any assignee.  

**Expected Result:**  
- The system should prevent moving a work order to "Completed" if no user is assigned.  
- An error or validation message should appear: `"Work order cannot be completed without an assignee."`  

**Actual Result:**  
- The work order is successfully moved to "Completed" despite being unassigned.  
- No validation or warning message is displayed.  

**Evidence:**  
- Logs for [TC-003] → [TC-007] → [TC-004] (Automated Test Log)
- Screenshots showing the work order status as "Completed" while assignee field is empty  

---

## **Bug 4: Cancel Button Visible on Completed Work Order**

**Affected Test Case IDs:** [TC-010][TC-011]  
**Module:** Work Order Page / Action Buttons  
**Environment:** QA / Local  
**Browser:** Chromium  
**Severity:** Medium  

**Description:**  
After a work order reaches the **Completed** status, the **"Cancel" button** is still visible and clickable. This allows users to perform actions that should not be possible on a completed work order, potentially breaking the workflow or causing data inconsistency.  

**Steps to Reproduce:**  
1. Login as a manager or coordinator.  
2. Complete a work order by moving it through the full workflow to "Completed".  
3. Observe the action buttons on the completed work order.  

**Expected Result:**  
- The "Cancel" button should **not be visible** once the work order status is "Completed".  
- Only allowed actions (if any) for completed work orders should be displayed.  

**Actual Result:**  
- The "Cancel" button is still visible and clickable.  

**Evidence:**  
- Screenshot of the completed work order with the "Cancel" button visible.  
- Logs from [TC-010][TC-011]  (Automated Test Log)


---

## **Bug 5: No Validation on Cancellation Reason Field**

**Affected Test Case IDs:** [TC-013][TC-014]  
**Module:** Work Order Cancellation / Cancellation Reason Field  
**Environment:** QA / Local  
**Browser:** Chromium  
**Severity:** High  

**Description:**  
The system allows users to cancel a work order without entering a cancellation reason. The **Cancellation Reason** field does not enforce validation, which may result in incomplete audit history and lack of accountability.  

**Steps to Reproduce:**  
1. Login as a manager or coordinator  
2. Open an existing work order  
3. Click **Cancel**  
4. Leave **Cancellation Reason** field empty  
5. Confirm cancellation  

**Expected Result:**  
- The system should require a **Cancellation Reason** before allowing cancellation  
- Validation message should appear: `"Cancellation reason is required."`  
- Cancellation should not proceed until the field is filled  

**Actual Result:**  
- Work order is cancelled successfully without entering a cancellation reason  
- No validation message displayed  

**Evidence:**  
- Screenshot showing cancellation completed without reason  
- Logs for [TC-013][TC-014] (Automated Test Log)


---

## **Bug 6: Work Order is Hard Deleted with No Option to View Deleted Work Orders**

**Affected Test Case IDs:** [TC-015][TC-016]  
**Module:** Work Order Deletion / Work Order Management  
**Environment:** QA / Local  
**Browser:** Chromium
**Severity:** Critical    

**Description:**  
When a work order is deleted, it is permanently removed from the system (hard delete). There is no option to view deleted work orders, restore them, or track deletion history. This may lead to data loss and lack of auditability.  

**Steps to Reproduce:**  
1. Login as a manager
2. Open an existing work order  
3. Delete the work order  
4. Attempt to search or locate the deleted work order  

**Expected Result:**  
- Work order should be **soft deleted**  
- Deleted work orders should be accessible via:
  - "Deleted" tab  
  - "Archived" section  
  - Filter option  

**Actual Result:**  
- Work order is permanently deleted  
- No option to view deleted work orders   

**Evidence:**  
- Screenshot showing deleted work order no longer exists  
- Logs for [TC-015][TC-016]  (Automated Test Log)

---

## **Bug 7: Inconsistent Cancel Button Layout in Work Order Table Page**

**Affected Test Case IDs:** [TC-017][TC-018]  
**Module:** Work Order Table Page / Action Buttons  
**Environment:** QA / Local  
**Browser:** Chromium  
**Severity:** Low  

**Description:**  
The **Cancel** button layout in the **Work Order Table Page** is inconsistent compared to other action buttons. The alignment, spacing, or placement differs, which affects UI consistency and may cause confusion for users.

**Steps to Reproduce:**  
1. Login as a manager
2. Navigate to Work Order Table Page  
3. Locate a work order with available actions  
4. Observe the **Cancel** button layout  
5. Compare with other buttons in the same table row  

**Expected Result:**  
- Cancel button should be aligned consistently with other action buttons  
- Button spacing and layout should follow UI standards  

**Actual Result:**  
- Cancel button layout is inconsistent  
- Alignment or spacing differs from other buttons  

**Evidence:**  
- Screenshot showing Cancel button misalignment  
- Logs for [TC-017][TC-018]  (Automated Test Log)

