import { test, Page, Locator, expect } from '@playwright/test';
import { CommonLocators } from '../locators/commonLocators';

export class CommonUserActionsPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Click on a button by its visible text.
   *
   * Usage:
   * ```ts
   * await userAction.clickOnButton("Add to Cart");
   * ```
   *
   * @param buttonName - The exact visible text of the button to click.
   */
  async clickOnButton(buttonName: string): Promise<void> {
    await test.step(`Click On Button: "${buttonName}"`, async () => {
      const locatorElement = this.page.locator(CommonLocators.buttonLocator(buttonName));
      expect(locatorElement.first(), `The button "${buttonName}" is NOT visible`).toBeVisible();
      await locatorElement.first().click();
      console.log(`The button "${buttonName}" clicked`);
    });
  }

  /**
   * Fill a text input field by its label.
   *
   * Usage:
   * ```ts
   * await userAction.inputOnTextField("Email", "test@example.com");
   * ```
   *
   * @param fieldName - The visible label of the input field.
   * @param text - The text to input.
   */
  async inputOnTextField(fieldName: string, text: string): Promise<void> {
    await test.step(`Input On Text Field: ${fieldName} with Text: ${text}`, async () => {
      const locatorElement = this.page.locator(CommonLocators.inputFieldLocator(fieldName));
      await locatorElement.fill(text);
      await locatorElement.press('Tab'); // Trigger onBlur events
      console.log(`The field "${fieldName}" filled with text: ${text}`);
    });
  }

  /**
   * Input on a field using multiple strategies (role, label, placeholder, XPath).
   *
   * Usage:
   * ```ts
   * await userAction.inputOnField("Email", "test@example.com");
   * ```
   *
   * @param fieldName - Name or label of the field.
   * @param textInput - Text to input into the field.
   */
  async inputOnField(fieldName: string, textInput: string): Promise<void> {
    await test.step(`Input On Field: ${fieldName} with Value: ${textInput}`, async () => {
      type LocatorObj = { desc: string; getLocator: () => Locator };
      const locators: LocatorObj[] = [
        { desc: 'role locator', getLocator: () => this.page.getByRole('textbox', { name: fieldName, exact: true }) },
        { desc: 'label locator', getLocator: () => this.page.getByLabel(fieldName, { exact: true }) },
        { desc: 'placeholder locator', getLocator: () => this.page.getByPlaceholder(fieldName, { exact: true }) },
        { desc: 'XPath locator', getLocator: () => this.page.locator(CommonLocators.inputFieldLocator(fieldName)) }
      ];

      for (const { desc, getLocator } of locators) {
        const locator = getLocator();
        if ((await locator.count()) > 0) {
          await locator.fill(textInput);
          console.log(`The input field "${fieldName}" filled with value: ${textInput} using ${desc}`);
          return;
        }
      }

      throw new Error(`Input field "${fieldName}" not found using role, label, placeholder, or XPath locator.`);
    });
  }

  /**
   * Select a tab by its visible text.
   *
   * Usage:
   * ```ts
   * await userAction.selectTab("Details");
   * ```
   *
   * @param tabName - The exact visible text of the tab.
   */
  async selectTab(tabName: string): Promise<void> {
    await test.step(`Select tab: "${tabName}"`, async () => {
      const textLocator = this.page.getByText(tabName);
      const xpathLocator = this.page.locator(CommonLocators.tabLocator(tabName));
      const locator = (await textLocator.isVisible()) ? textLocator : xpathLocator;

      if (!(await locator.isVisible())) throw new Error(`Tab "${tabName}" not found`);
      await locator.click();
      console.log(`Selected tab: "${tabName}"`);
    });
  }

  /**
   * Get the work order creation toast message and extract the Work Order ID.
   *
   * Usage:
   * ```ts
   * const { message, workOrder } = await userAction.getWorkOrderToastMessage();
   * ```
   *
   * @returns Object containing the full message and extracted Work Order ID.
   */
  async getWorkOrderToastMessage(): Promise<{ message: string; workOrder: string }> {
    return await test.step('Get Work Order toast message', async () => {
      const toast = this.page.getByText(/Work order WO-\d{4}-\d+ created!/);
      await expect(toast).toBeVisible({ timeout: 5000 });

      const message = (await toast.textContent())?.trim() || '';
      const match = message.match(/WO-\d{4}-\d+/);
      const workOrder = match?.[0] || '';

      console.log(`Toast message: ${message}`);
      console.log(`Work Order captured: ${workOrder}`);

      return { message, workOrder };
    });
  }

  /**
   * Click a text link by exact visible text.
   *
   * Usage:
   * ```ts
   * await userAction.clickTextLink("WO-1234");
   * ```
   *
   * @param linkText - Exact text of the link to click.
   */
  async clickTextLink(linkText: string): Promise<void> {
    await test.step(`Click text link: "${linkText}"`, async () => {
      const link = this.page.getByText(linkText, { exact: true });
      await expect(link).toBeVisible({ timeout: 5000 });
      await link.click();
      console.log(`Clicked link: "${linkText}"`);
    });
  }


}