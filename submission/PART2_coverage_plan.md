## Part 2 — Plan Additional Test Coverage
### Work Order Creation
Required Fields
- P0 Should Show Error When Short Description Is Empty
- P0 Should Show Error When Site Is Not Selected
- P0 Should Show Error When Priority Is Not Selected
- P1 Should Remove Error When Field Is Corrected
Short Description
- P0 Should Prevent Only Whitespace Input
- P1 Should Prevent Short Description Over 200 Characters
- P1 Should Allow Special Characters
Location Validation
- P0 Should Location Selection Hierarchy Follows Site → Building → Floor → Room
- P1 Should Reset Building, Floor and Room When Site Changes
- P1 Should Reset Floor and Room When Building Changes
- P1 Should Reset Room When Floor Changes
Submission Behaviour
- P0 Should Prevent Submission With Validation Errors
- P0 Should Allow Submission With Only Required Fields


### Status Transition
- P0 Should Complete Full Work Order Status Workflow
- P0 Should Allow Delay From Valid Status and Resume
- P0 Should Allow Cancel From Valid Status


### Role-Based Access Control
Create Work Order Permissions
- P0 Should Allow Coordinator To Create Work Order
- P0 Should Allow Manager To Create Work Order
- P0 Should Allow Stakeholder To Create Work Order
- P0 Should Not Allow Supplier To Create Work Order
- P0 Should Not Allow Works User To Create Work Order

Status Permissions
- P0 Should Allow Coordinator To Update Status Only For Move
- P0 Should Allow Manager To Update All Status
- P0 Should Prevent Stakeholder From Updating Status
- P0 Should Prevent Supplier Status Updates
- P1 Should Prevent Works User Status Updates

Assignment Permissions
- P0 Should Allow Manager To Assign Work Orders
- P0 Should Allow Coordinator To Assign Work Orders
- P0 Should Prevent Stakeholder From Assigning
- P0 Should Prevent Supplier From Assigning
- P0 Should Prevent Worker From Assigning

Cancel Permissions
- P0 Should Allow Manager To Cancel Work Orders
- P0 Should Prevent Coordinator From Cancelling
- P0 Should Prevent Stakeholder From Cancelling
- P0 Should Prevent Supplier From Cancelling
- P0 Should Prevent Worker From Cancelling


### Data Integrity
Soft Deletes
- P0 Should Show Soft Deleted Work Orders In Filter
- P0 Should Prevent Editing Soft Deleted Work Orders
- P0 Should Prevent Status Changes On Soft Deleted Work Orders

Audit Trail
- P1 Should Record Multiple Changes In Order
- P1 Should Preserve Audit History
- P1 Should Display Audit Log In Detail View


### UI / UX Behaviour
Cascading Dropdowns
Core Behaviour
- P1 Should Reset Dependent Fields When Parent Changes
- P1 Should Disable Building Until Site Selected
- P1 Should Disable Floor Until Building Selected
- P1 Should Disable Room Until Floor Selected


### Filters
Filtering Behaviour 
- P1 Should Show No Results When No Match With Filters Status, Priority and Search
- P1 Should Show No Results When No Match With Filters Status, and Priority
- P1 Should Show No Results When No Match With Filters Status, and Search
- P1 Should Show No Results When No Match With Filters Priority, and Search
