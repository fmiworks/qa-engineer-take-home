import { test, Page, expect } from '@playwright/test';
import { CommonLocators } from '../locators/commonLocators';
import { WebTableHelper } from '../utils/webTableHelper';  

export class CommonAssertionsPage {
  private page: Page;
  private webTableHelper: WebTableHelper;

  constructor(page: Page) {
    this.page = page;
    this.webTableHelper = new WebTableHelper(page);
  }

  /**
   * Assert the "work order created" toast message is visible and return the Work Order number.
   *
   * Usage:
   * ```ts
   * const woNumber = await assertions.assertAndGetWorkOrderFromToast();
   * ```
   *
   * @returns The captured Work Order ID (e.g., "WO-1234-1") as string.
   */
  async assertAndGetWorkOrderFromToast(): Promise<string> {
    return await test.step('Assert toast and get Work Order number', async () => {
      const toast = this.page.getByText(/Work order WO-\d{4}-\d+ created!/);

      await expect(toast).toBeVisible({ timeout: 5000 });

      const message = (await toast.textContent())?.trim() || '';
      console.log(`Toast message asserted: ${message}`);

      const match = message.match(/WO-\d{4}-\d+/);
      const workOrder = match?.[0] || '';

      console.log(`Work Order captured: ${workOrder}`);
      return workOrder;
    });
  }

  /**
   * Assert that a toast message is visible.
   *
   * Usage:
   * ```ts
   * await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ moved to Delayed/);
   * ```
   *
   * @param expectedMessage - The exact string or RegExp pattern of the expected toast message.
   */
  async assertToastMessage(expectedMessage: string | RegExp): Promise<void> {
    await test.step(`Assert toast message: "${expectedMessage}"`, async () => {
      const toast = this.page.locator(CommonLocators.toastMessageLocator);
      await expect(toast).toContainText(expectedMessage);

      const actualMessage = (await toast.textContent())?.trim() || '';
      console.log(`Expected toast: "${expectedMessage}" | Actual toast: "${actualMessage}"`);
    });
  }

  /**
   * Assert that a text link is visible on the page.
   *
   * Usage:
   * ```ts
   * await assertions.assertTextLinkVisible("WO-1234");
   * ```
   *
   * @param linkText - The exact text of the link to assert visibility.
   */
  async assertTextLinkVisible(linkText: string): Promise<void> {
    await test.step(`Assert text link is visible: "${linkText}"`, async () => {
      const link = this.page.getByText(linkText, { exact: true });
      await expect(link).toBeVisible({ timeout: 5000 });
      console.log(`Link is visible: "${linkText}"`);
    });
  }

  /**
   * Assert that specific text is visible on the page.
   *
   * Usage:
   * ```ts
   * await assertions.assertTextVisible("Some message");
   * ```
   *
   * @param text - The exact text to assert is visible.
   */
  async assertTextVisible(text: string): Promise<void> {
    await test.step(`Assert text is visible: "${text}"`, async () => {
      const element = this.page.getByText(text, { exact: true });
      await expect(element).toBeVisible({ timeout: 5000 });
      console.log(`Text is visible: "${text}"`);
    });
  }

  /**
   * Assert that a form error message is visible.
   *
   * Usage:
   * ```ts
   * await assertions.assertErrorMessageVisible("Field is required");
   * ```
   *
   * @param text - The error message text to assert.
   */
  async assertErrorMessageVisible(text: string): Promise<void> {
    await test.step(`Assert form error message is visible: "${text}"`, async () => {
      const element = this.page.locator(CommonLocators.formErrorLocator(text));
      await expect(element).toBeVisible();
      console.log(`Form error message visible: "${text}"`);
    });
  }

  /**
   * Assert that a specific cell value in a web table matches the expected value.
   *
   * Usage:
   * ```ts
   * await assertions.assertTableCellValue("WO-1234", "Priority", "Critical");
   * ```
   *
   * @param rowName - The row identifier (e.g., Work Order ID).
   * @param columnName - The column name to check.
   * @param expectedValue - The expected cell value.
   */
  async assertTableCellValue(
    rowName: string,
    columnName: string,
    expectedValue: string | undefined
  ): Promise<void> {
    await test.step(`Verify Table Cell - Row: "${rowName}", Column: "${columnName}", Expected: "${expectedValue}"`, async () => {
      const actualValue = await this.webTableHelper.getCellValue(rowName, columnName);
      console.log(`Actual value retrieved from table: "${actualValue}"`);
      expect(actualValue).toBe(expectedValue);
    });
  }

  /**
   * Assert that a specific tab is not visible on the page.
   *
   * Usage:
   * ```ts
   * await assertions.assertTabNotVisible("Details");
   * ```
   *
   * @param tabName - The name of the tab to assert is not visible.
   */
  async assertTabNotVisible(tabName: string): Promise<void> {
    await test.step(`Assert tab NOT visible: "${tabName}"`, async () => {
      const textLocator = this.page.getByText(tabName);
      const xpathLocator = this.page.locator(CommonLocators.tabLocator(tabName));
      const locator = textLocator.or(xpathLocator);
      await expect(locator).not.toBeVisible();
      console.log(`Tab is not visible: "${tabName}"`);
    });
  }

  /**
   * Assert that a dropdown contains only the expected options (ignoring the first placeholder option).
   *
   * Usage:
   * ```ts
   * await assertions.assertDropdownOnlyOptions("WO-1234", ["Work In Progress", "Delayed"]);
   * ```
   *
   * @param workID - The work order ID corresponding to the dropdown.
   * @param expectedOptions - Array of expected option texts (excluding the placeholder).
   */
  async assertDropdownOnlyOptions(workID: string, expectedOptions: string[]): Promise<void> {
    await test.step(`Assert dropdown options for Work Order: ${workID}`, async () => {
      const dropdownLocator = this.page.locator(CommonLocators.moveStatusDropdownLocator(workID));
      const optionElements = dropdownLocator.locator('option');
      const optionCount = await optionElements.count();

      dropdownLocator.click(); // Ensure dropdown options are rendered

      if (optionCount === 0) {
        throw new Error(`No options found for dropdown of Work Order ${workID}`);
      }

      const optionTexts = await optionElements.allTextContents();
      const normalizedOptions = optionTexts.slice(1).map(o => o.trim());

      console.log(`Dropdown options for Work Order ${workID}:`, normalizedOptions);
      expect(normalizedOptions).toEqual(expectedOptions);
    });
  }
}