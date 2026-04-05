/**
 * CommonLocators
 *
 * Centralized repository for reusable dynamic XPath locators.
 * Each locator is defined as a function that accepts a parameter
 * (e.g., button name, field name) and returns the corresponding XPath.
 */
export const CommonLocators = {

  /**
   * Locator for a button element.
   * - Matches button text case-insensitively.
   *
   * Example:
   *   CommonLocators.buttonLocator("Register")
   *   → //button[contains(translate(normalize-space(string()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "register")]
   *
   * @param buttonName - The visible text of the button.
   * @returns XPath locator string.
   */
  buttonLocator: (buttonName: string): string =>
    `//button[contains(
        translate(normalize-space(string()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),
        "${buttonName.toLowerCase()}"
      )]`,

  /**
   * Locator for input fields or textareas.
   * - Matches based on placeholder, label, or name attributes.
   * - Supports textarea inside a div with a label.
   *
   * Example:
   *   CommonLocators.inputFieldLocator("Email")
   *   → //input[@placeholder="Email" or @label="Email" or @name="Email"]
   *     | //textarea[@placeholder="Email" or @label="Email" or @name="Email"]
   *     | //div[div[label[contains(string(), "Email")]]]//input
   *
   * @param fieldName - The label, placeholder, or name of the field.
   * @returns XPath locator string.
   */
  inputFieldLocator: (fieldName: string): string =>
    `//input[@placeholder="${fieldName}" or @label="${fieldName}" or @name="${fieldName}"]
     | //textarea[@placeholder="${fieldName}" or @label="${fieldName}" or @name="${fieldName}"]
     | //div[div[label[contains(normalize-space(.), "${fieldName}")]]]//input`,

  /**
   * Locator for a dropdown element by option label.
   *
   * Example:
   *   CommonLocators.dropdownOptionLocator("Philippines")
   *   → //div[label[contains(text(), "Philippines")]]/select
   *
   * @param optionName - The visible label of the dropdown.
   * @returns XPath locator string.
   */
  dropdownOptionLocator: (optionName: string): string =>
    `//div[label[contains(text(), "${optionName}")]]/select`,

  /**
   * Locator for a checkbox input associated with a visible label.
   *
   * Example:
   *   CommonLocators.checkBoxLocator("Sports")
   *   → //div[label[contains(normalize-space(.), "Sports")]]//input[@type="checkbox"]
   *
   * @param labelName - The visible label text next to the checkbox.
   * @returns XPath locator string for the checkbox input element.
   */
  checkBoxLocator: (labelName: string): string =>
    `//div[label[contains(normalize-space(.), "${labelName}")]][input[@type="checkbox"]]`,

  /**
   * Locator for a radio button input associated with a visible label.
   *
   * Example:
   *   CommonLocators.radioButtonLocator("Male")
   *   → //div[label[contains(normalize-space(.), "Male")]]//input[@type="radio"]
   *
   * @param labelName - The visible label text next to the radio button.
   * @returns XPath locator string for the radio input element.
   */
  radioButtonLocator: (labelName: string): string =>
    `//div[label[contains(normalize-space(.), "${labelName}")]][input[@type="radio"]]`,

  /**
   * Locator for a date picker input associated with a label.
   *
   * @param labelName - The label text of the date picker field.
   * @returns XPath locator string for the date picker input element.
   */
  datePickerLocator: (labelName: string): string =>
    `//div[div[label[contains(normalize-space(.), "${labelName}")]]]//input`,

  /**
   * Locator for a tab element by its visible text.
   *
   * @param tabName - The text of the tab.
   * @returns XPath locator string for the tab.
   */
  tabLocator: (tabName: string): string =>
    `//div[@class="tab"][contains(string(), "${tabName}")]`,

  /**
   * Locator for toast messages.
   */
  toastMessageLocator: `//div[@id="toast"]`,

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