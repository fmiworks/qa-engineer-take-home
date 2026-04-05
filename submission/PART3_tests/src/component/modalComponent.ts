import { Page } from '@playwright/test';

export class ModalComponent {
  constructor(private page: Page) {}

  /**
   * Handle browser dialog with optional input
   */
  async inputOnDialog(inputText?: string): Promise<void> {
    this.page.once('dialog', async dialog => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept(inputText);
    });
  }
}