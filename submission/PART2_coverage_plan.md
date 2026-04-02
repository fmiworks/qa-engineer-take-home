# Part 2: Additional Test Coverage Plan

## Coverage Strategy

**Test activities are organized according to potential business impact, workflow reliability, and compliance requirements.**

- **P0 – Critical:** High-impact areas such as workflow consistency, role-based access, audit trail accuracy, and actions that could modify or delete data.
- **P1 – Moderate:** Medium-risk aspects including form validation, assignment behavior, and filtering logic.
- **P2 – Low:** Low-risk areas focusing on user experience, interface polish, edge cases, and usability enhancements.

### Testing Scope

- Expected/positive behavior under normal conditions  
- Edge cases and invalid inputs  
- Enforcement of role-based permissions  
- Data integrity and auditability checks  

---

## Area 1: Work Order Creation (Create New)

### P0
- Check Required field validation: Short Description, Site, Priority  
- Check Short Description rules: max 200 chars, reject empty/whitespace  
- Check Location hierarchy enforcement: Site → Building → Floor → Room  
- Check Cascading dropdown behavior  
- Check Role-based creation access: Coordinator, Manager allowed
- Check Role-based creation restriction: Stakeholder, Works User, Supplier  not allowed  
- Default values: Status = New Request, Source = Adhoc Request  

### P1

- Check if order created with all filling fields including non mandatory fields
- Partial location selection prevention  
- Clear button functionality  
- Switching site resets dependent fields  

### P2
- Character counter updates  
- Validation messages clarity  
- Accessibility (keyboard navigation)  
---

## Area 2: Work Order Lifecycle (Status Transitions)

### Work Order Workflow Definition

Work orders follow multiple supported flows:

**Flow A:**  
New --> Under Consideration -->  Scheduled -->  Work In Progress -->  Completed  

**Flow B:**  
New -->  Under Consideration -->  Pending Quote -->  Scheduled -->  Work In Progress -->  Completed  

**Flow C:**  
New -->  Under Consideration -->  Scheduled -->  Work In Progress -->  Delayed -->  Work In Progress -->  Completed  

**Flow D:**  
New -->  Under Consideration -->  Pending Quote -->  Scheduled -->  Work In Progress -->  Delayed -->  Work In Progress -->  Completed  
 

### Additional Rules for Work Order
- Cancellation: Manager can cancel a work order at any stage  
- Assignment: Assignments can be made at any stage by authorized roles  

### P0
- Validate all workflow variations end-to-end  
- Prevent invalid transitions  
- Terminal states (Completed, Cancelled) restrictions  
- Dynamic UI enforcement (only valid statuses visible)  

### P1
- Certain transitions require assignment  

### P2
- Status badges update correctly  
- Audit log reflects all transitions  

---

## Area 3: Role-Based Access

### Role Permission Matrix

**Test All User Roles Permission Based on below Matrix:**

| Role        | Move Status | Assign | Cancel | Delete | Create WO |
|-------------|-------------|--------|--------|--------|-----------|
| Coordinator | ✅           | ✅      | ❌      | ❌      | ✅         |
| Manager     | ✅           | ✅      | ✅      | ✅      | ✅         |
| Stakeholder | ❌           | ❌      | ❌      | ❌      | ❌         |
| Works User  | ✅           | ❌      | ❌      | ❌      | ❌         |
| Supplier    | ✅           | ❌      | ❌      | ❌      | ❌         |

### P0
- Check Role-permission enforcement  
- Check Create Work Order  
- Check Status transitions per role  
- Check Assignment permission  
- Check Cancel/Delete **(Manager only)**  
- Check Role-based UI rendering  
- Check Data visibility per role  

### P1
- UX clarity for actions  

---

## Area 4: Assignment Management

### P0
- Check Assign / Reassign to valid users 
- Check Role Based  assignment access
- Assignment required before transitions 
- Check assignment working fine and displaying in Table, Work Order Details pop-upand Logs properly 
like :
a- Correct Assignee visible in Table after assignment
b- Correct Assignee visible on Work Order Details pop-up after assignment
c- Correct Assignee visible in Audit Log after assignment


### P1
- Chck Role-based assignment restrictions  

### P2
- Random data input validation (special characters, long data)  

---

## Area 5: Data Integrity & Auditability

### P0
- Check Audit logs for all actions  
- Check Soft delete enforcement  
- No internal IDs exposed  

### P1
- Data consistency  
- Timestamp validation  

---

## Area 6: Filtering, Search and Sorting

### P1
- Status filter (all states)  
- Priority filter  
- Combined filters  
- Search + filter  
- Filter persistence  

### P2
- Empty state handling  
- Sorting feature  
- Refresh cases  
- Edge cases (rapid switching, large datasets)  

---

## Area 7: UI/UX Behavior

### P1
- Cascading dropdowns  
- Action buttons visibility  
- Feedback messages  
- Loading states  

### P2
- Modal behavior  
- Visual consistency  
- Error handling UX  

---

## Area 8: Delete / Cancel Handling

### P0
- Manager-only enforcement  
- Soft delete validation  
- Audit logging  

### P1
- Cancelled items visibility  

---

## Area 9: Work Order Details (Popup / View)

### P0
- Popup opens on WO click  
- Correct field display:
  - WO Number  
  - Short Description  
  - Room  
  - Status, Priority, Location  
  - Full Description, Source  
  - Assigned To  
  - Created By / Date  

- Audit log:
  - Chronological order  
  - User + action + timestamp  

- Delete action:
  - Confirmation modal  
  - Soft delete  
  - Audit update  

### P1
- RBAC enforcement in popup  
- Audit log visibility  
- Status transitions reflect dynamically  
- Multiple assignments handled clearly  

### P2
- Popup performance with large logs  
- Modal close behavior  