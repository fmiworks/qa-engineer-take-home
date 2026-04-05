/**
 * CommonLocators
 *
 * Centralized repository for reusable dynamic XPath locators.
 * Each locator is defined as a function that accepts a parameter
 * (e.g., button name, field name) and returns the corresponding XPath.
 */
export const WorkOrderLocators = {


  /**
   * Locator for toast messages.
   */
  roleDropdownLocator: `//div[@id="toast"]`,

  /**
   * Locator for a form error message.
   *
   * @param errorMessage - Text content of the error message.
   * @returns XPath locator string for the error message div.
   */
  formErrorLocator: (errorMessage: string): string =>
    `//div[@id="formErrors"][contains(string(), "${errorMessage}")]`,


  moveStatusDropdownLocator: (workOrderId: string): string =>
    `//select[@data-testid="action-status-${workOrderId}"]`


};