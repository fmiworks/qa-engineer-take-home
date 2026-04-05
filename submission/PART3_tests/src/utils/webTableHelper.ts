import { expect, Page, Locator, test } from '@playwright/test';

type MatchMode = 'exact' | 'partial';

/**
 * Helper class to interact with and retrieve data from HTML tables.
 */
export class WebTableHelper {
  constructor(private page: Page) {}

  /**
   * Normalize text for comparison (lowercase + trimmed).
   * @param text - Text to normalize.
   */
  private normalize(text: string) {
    return text.toLowerCase().trim();
  }

  /**
   * Compare two strings with exact or partial match mode.
   * @param a - First string.
   * @param b - Second string.
   * @param mode - 'exact' or 'partial'.
   */
  private match(a: string, b: string, mode: MatchMode) {
    const A = this.normalize(a);
    const B = this.normalize(b);
    return mode === 'exact' ? A === B : A.includes(B);
  }

  /**
   * Get all table headers as an array of strings.
   *
   * Usage:
   *   const headers = await tableHelper.getHeaders();
   *
   * @returns Array of header names.
   */
  async getHeaders(): Promise<string[]> {
    return await test.step('Get table headers', async () => {
      const headers = await this.page.locator('table thead th').allInnerTexts();
      return headers.map(h => h.trim());
    });
  }

  /**
   * Get the column index of a header by name.
   *
   * Usage:
   *   const index = await tableHelper.getColumnIndex("Priority");
   *
   * @param columnName - Header name to search.
   * @param mode - Match mode ('exact' | 'partial'), default is 'partial'.
   * @returns Column index (0-based).
   */
  async getColumnIndex(columnName: string, mode: MatchMode = 'partial'): Promise<number> {
    return await test.step(`Find column index for "${columnName}" (mode: ${mode})`, async () => {
      const headers = await this.getHeaders();
      const index = headers.findIndex(h => this.match(h, columnName, mode));

      if (index === -1) {
        throw new Error(`Column "${columnName}" not found.\nAvailable: ${headers.join(', ')}`);
      }

      console.log(`Found column "${columnName}" at index ${index} (mode: ${mode})`);
      return index;
    });
  }

  /**
   * Find a table row by text content with optional retry.
   *
   * Usage:
   *   const row = await tableHelper.getRow("WO-1234");
   *
   * @param rowText - Text to match in the row.
   * @param options - Optional: { timeout, mode }.
   * @returns Playwright Locator for the row.
   */
  async getRow(rowText: string, options?: { timeout?: number; mode?: MatchMode }): Promise<Locator> {
    return await test.step(`Find row with text "${rowText}"`, async () => {
      const timeout = options?.timeout ?? 5000;
      const mode = options?.mode ?? 'partial';
      const start = Date.now();

      while (Date.now() - start < timeout) {
        const rows = this.page.getByRole('row');
        const count = await rows.count();

        for (let i = 0; i < count; i++) {
          const row = rows.nth(i);
          const text = (await row.innerText()).trim();
          if (this.match(text, rowText, mode)) return row;
        }

        await this.page.waitForTimeout(300);
      }

      const allRows = await this.page.getByRole('row').allInnerTexts();
      console.log('Available rows:', allRows);
      throw new Error(`Row "${rowText}" not found after ${timeout}ms`);
    });
  }

  /**
   * Get the text content of a specific cell in the table.
   *
   * Usage:
   *   const value = await tableHelper.getCellValue("WO-1234", "Priority");
   *
   * @param rowText - Identifier text for the row.
   * @param columnName - Column header name.
   * @param options - Optional: { timeout, matchMode, columnMatchMode }.
   * @returns Cell text or null if empty.
   */
  async getCellValue(
    rowText: string,
    columnName: string,
    options?: { timeout?: number; matchMode?: MatchMode; columnMatchMode?: MatchMode }
  ): Promise<string | null> {
    return await test.step(`Get cell value at [${rowText} → ${columnName}]`, async () => {
      const row = await this.getRow(rowText, { timeout: options?.timeout, mode: options?.matchMode ?? 'partial' });
      const colIndex = await this.getColumnIndex(columnName, options?.columnMatchMode ?? 'partial');
      const cell = row.getByRole('cell').nth(colIndex);

      await expect(cell).toBeVisible();
      const value = (await cell.textContent())?.trim() || null;

      console.log(`The cell [${rowText}] -> Column [${columnName}] = ${value}`);

      await test.info().attach('table-log', {
        body: `Row: ${rowText}\nColumn: ${columnName}\nValue: ${value}`,
        contentType: 'text/plain',
      });

      return value;
    });
  }

  /**
   * Click a button or action inside a specific table cell.
   *
   * Usage:
   *   await tableHelper.clickCellAction("WO-1234", "Actions", "Edit");
   *
   * @param rowText - Row identifier.
   * @param columnName - Column name.
   * @param buttonName - Button title attribute to click.
   */
  async clickCellAction(rowText: string, columnName: string, buttonName: string) {
    await test.step(`Click "${buttonName}" in [${rowText} → ${columnName}]`, async () => {
      const row = await this.getRow(rowText);
      const colIndex = await this.getColumnIndex(columnName);
      const button = row.getByRole('cell').nth(colIndex).locator(`[title="${buttonName}"]`);
      expect(button).toBeVisible();
      await button.click();
      console.log(`Clicked "${buttonName}" in [${rowText} → ${columnName}]`);
    });
  }

  /**
   * Get all text values from a specific column.
   *
   * Usage:
   *   const priorities = await tableHelper.getColumnValues("Priority");
   *
   * @param columnName - Name of the column.
   * @returns Array of cell values in the column.
   */
  async getColumnValues(columnName: string): Promise<string[]> {
    return await test.step(`Get all values from column "${columnName}"`, async () => {
      const colIndex = await this.getColumnIndex(columnName, 'partial');
      const rows = this.page.getByRole('row');
      const count = await rows.count();
      const values: string[] = [];

      for (let i = 1; i < count; i++) {
        const cell = rows.nth(i).getByRole('cell').nth(colIndex);
        const text = (await cell.textContent())?.trim();
        if (text) values.push(text);
      }

      console.log(`Column "${columnName}" values:`, values);
      return values;
    });
  }
}