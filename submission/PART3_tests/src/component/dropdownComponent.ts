import { Page, test, Locator } from '@playwright/test';

export class DropdownComponent {
  constructor(private page: Page) {}

  async selectDropdownOption(fieldLabel: string, optionLabel: string): Promise<void> {
    await test.step(`Select option "${optionLabel}" from dropdown "${fieldLabel}"`, async () => {
      const dropdown: Locator = this.page.getByLabel(fieldLabel);
      await dropdown.selectOption({ label: optionLabel });
    });
  }

  async selectRandomDropdownOption(fieldLabel: string): Promise<string | undefined> {
    return await test.step(`Select random option from "${fieldLabel}" dropdown`, async () => {
      const dropdown = this.page.getByLabel(fieldLabel);
      const options = await dropdown.locator('option').allTextContents();

      const validOptions = options
        .map(opt => opt.trim())
        .filter(opt => opt && !opt.toLowerCase().includes('select'));

      if (!validOptions.length) return undefined;

      const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
      await dropdown.selectOption({ label: randomOption });

      return randomOption;
    });
  }

  async selectDropdownByLocator(locator: string, option: string): Promise<void> {
    await test.step(`Select "${option}" from dropdown`, async () => {
      await this.page.selectOption(locator, { label: option });
    });
  }
}