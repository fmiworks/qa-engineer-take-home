# Part 4: Bug Reports

## Bug 1: Selected Floor and Room are not reflected in the Location column after work order creation

**Description**

Floor and Room values selected during work order creation are not displayed in the Location column in the Work Orders list.

**Steps to Reproduce**
1. Login with any user who can create Work Order like Coordinator
2. Navigate to Work Orders> Create New.
2. Fill all the fields on the form like Floor, Room Site, Priority etc
3. Click on "Create Work Order" button
4. Check the "Location" in Location column of the Created Work Order  

**Expected Behavior**
Location column should display full hierarchy:
Site → Building → Floor → Room

**Actual Behavior**
Location column displays only:
Site → Building
Floor and Room are missing

**Severity / Priority**
- Severity: High
- Priority: High

**Screenshot/Recording**
- https://www.loom.com/share/7fc6024894f34fa087cecb96b2a17416

---

## Bug 2: Success message is shown even when a work order is not created and mandatory fields are missing.

**Description**
When a user attempts to create a work order without filling in mandatory fields (Short Description, Site, and Priority), the system incorrectly displays a success message ("Work order created!") along with validation error messages.

**Steps to Reproduce**
1. Login with any user who can create Work Order like Coordinator
2. Navigate to Work Orders> Create New.
2. Leave mandatory fields (Short Description, Site, Priority) empty
3. Click on "Create Work Order" button

**Expected Behavior**
- Validation errors are shown below the respected field 
- No success toast appears.
- No work order is created.

**Actual Behavior**
- Validation errors are shown.
- A success toast appears: "Work order created!"

**Severity / Priority**
- Severity: Medium
- Priority: Medium

**Screenshot/Recording**
-  https://www.loom.com/share/fc4cdad782584f4da12bc4bd80bbab9a 

---

## Bug 3: Action buttons are misaligned in the Work Orders list

**Description**
The action buttons (e.g., Move to, Assign, Cancel) in the Work Orders list are not properly aligned within their respective rows. The buttons appear inconsistent in spacing and positioning, causing a cluttered and unstructured UI.

**Steps to Reproduce**
1. Login with any user who can perform the action on Work Order (e.g. Manager)
2. Check the alignment of buttons like Move to, Assign, and Cancel in Action Column 

**Expected Behavior**
- All action buttons should be consistently aligned within each row
- Proper spacing and layout should be maintained
- Buttons should follow a uniform structure (same position across all rows)

**Actual Behavior**
- Buttons are misaligned and inconsistent across rows
- Spacing between buttons varies
- UI looks cluttered and unorganized

**Severity / Priority**
- Severity: Minor
- Priority: Medium

**Screenshot/Recording**
- https://prnt.sc/D-PsSNK_3VAW

---


## Bug 4: Search fails when extra spaces are included in Work Order number input

**Description**
When a user enters a valid Work Order number in the search field with additional spaces (leading, trailing, or in-between), the system fails to return matching records. The search functionality appears to perform an exact match instead of handling trimmed or flexible input. The system should support partial matching or ignore unintended spaces (e.g., using a LIKE query or trimming input) to improve usability.

**Steps to Reproduce**
1. Navigate to Work Orders page
2. Enter a valid Work Order number (e.g., WO-2026-004816)
3. Modify the input by adding spaces (e.g., " WO-2026-004816 " or "WO-2026-004816 " )

**Expected Behavior**
- The system should ignore leading/trailing spaces or handle flexible matching
- The correct Work Order record should still be displayed
- Search should behave user-friendly (trim input or use partial match logic)

**Actual Behavior**
- No records are displayed when spaces are included in the search input

**Severity / Priority**
- Severity: Medium
- Priority: High

**Screenshot/Recording**
- https://prnt.sc/TQ70YtwGpCOo

---

## Suggestions to Improve Quality 5

**There are several areas for improvement, as outlined below**

## Suggestion 1
 We need to provide an option to edit Work Orders, allowing users to modify existing records.

## Suggestion 2
 We should implement column sorting and default sorting, so that newly created Work Orders are displayed at the top.

## Suggestion 3
 The "Cancel" button should be removed for completed Work Orders, as it does not make sense to cancel an already completed order. 

SCREENSHOT - https://prnt.sc/1QbtAunVb7LX

## Suggestion 4
 The assignment field should use a dropdown selection instead of manual number entry to improve usability and reduce errors.

SCREENSHOT - https://prnt.sc/jYc22J7qfENH

## Suggestion 5
 We should provide an option to restore deleted Work Orders, as there is currently no way to recover them.

## Suggestion 6
The system should display the reason for delayed Work Orders, so users understand why a delay has occurred.

## Suggestion 7
The UI is broken on mobile and tablet devices, and the layout appears misaligned. The page is not responsive, so it should be fixed and made fully responsive to ensure proper usability and accessibility across all screen sizes.

SCREENSHOT - https://prnt.sc/42WGGue6efJ0

## Suggestion 8
Building, Floor and Room fields should be mandatory when creating a work order so that users can identify the exact location.

SCREENSHOT - https://prnt.sc/roQwBA9SPEQa

## Suggestion 9
There should be validation to prevent submission when the user does not enter the Assignee Number and clicks on OK.

SCREENSHOT - https://prnt.sc/se3chOrnxAbY

---
