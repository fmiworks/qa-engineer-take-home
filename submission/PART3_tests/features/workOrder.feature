@smoke
Feature: FMI Works functionality

  Background:
    Given Navigate to the FMI Works application

  @deleteWorkOrder
  Scenario: Verify Manager is able to delete the work order
    When User select the role as "manager"
    And User clicks on the work order to delete
    Then User should see a confirmation message

  @assignedUser
  Scenario: Verify James Wilson (Manager) is able to assigned the user
    When User select the role as "manager"
    And Manager assigns the user to work order
    Then Work Order should be successfully assigned to the user

  @workflowStatusChange
  Scenario: The workflow should ensure all expected status-change records are added
    When User select the role as "coordinator"
    Then The work order status should be "New Request"
    And User transitions to "Under Consideration"
    Then The work order status should be "Under Consideration"
    And User transitions to "Pending Quote"
    Then The work order status should be "Pending Quote"
    And User transitions to "Scheduled"
    Then The work order status should be "Scheduled"
    And User transitions to "Work In Progress"
    Then The work order status should be "Work In Progress"
    And User transitions to "Delayed"
    Then The work order status should be "Delayed"
    And User transitions to "Work In Progress"
    Then The work order status should be "Work In Progress"
    # And User transitions to "Completed"
    And User describe the action taken "test Work Order" and transitions to "Completed"
    Then The work order status should be "Completed"
    And Transition status should not be visible

  @priorityFilters
  Scenario: Verify priority filters
    When User select the role as "works-user"
    And User select the priority option "Critical"
    Then only the "Critical" Work Orders should be displayed
    And User select the priority option "High"
    Then only the "High" Work Orders should be displayed
    And User select the priority option "Medium"
    Then only the "Medium" Work Orders should be displayed
    And User select the priority option "Low"
    Then only the "Low" Work Orders should be displayed
