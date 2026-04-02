export class DialogHelper {
  constructor(page) {
    this.page = page;
  }

  async handleDialogWithAction(action, dialogText = null) {
    await Promise.all([
      this.page.waitForEvent('dialog').then(d => {
        if (dialogText !== null) {
          d.accept(dialogText.toString());
        } else {
          d.accept();
        }
      }),
      action()
    ]);
  }

  async handleDialogWithClick(element, dialogText = null) {
    await Promise.all([
      this.page.waitForEvent('dialog').then(d => {
        if (dialogText !== null) {
          d.accept(dialogText.toString());
        } else {
          d.accept();
        }
      }),
      element.click()
    ]);
  }

  async handleDialogWithSelectOption(element, options, dialogText = null) {
    await Promise.all([
      this.page.waitForEvent('dialog').then(d => {
        if (dialogText !== null) {
          d.accept(dialogText.toString());
        } else {
          d.accept();
        }
      }),
      element.selectOption(options)
    ]);
  }
}
