import { Page, test, expect } from '@playwright/test';
import { CommonUserActionsPage } from '../core/commonUserActionsPage';
import { CommonAssertionsPage } from '../core/commonAssertionsPage';
import { CommonLocators } from '../locators/commonLocators';
import { DropdownComponent } from '../component/dropdownComponent';
import { ModalComponent } from '../component/modalComponent';

export class WorkOrderPage {
  readonly actions: CommonUserActionsPage;
  readonly assertions: CommonAssertionsPage;
  readonly dropdown: DropdownComponent;
  readonly modal: ModalComponent;
  workOrderId!: string;

  constructor(public page: Page) {
    this.actions = new CommonUserActionsPage(page);
    this.assertions = new CommonAssertionsPage(page);
    this.dropdown = new DropdownComponent(page);
    this.modal = new ModalComponent(page);

  }

  /**
   * Change work order status from actions dropdown.
   *
   * Usage:
   *   await managerWorkOrder.changeStatus('Under Consideration');
   *
   * @param status - The status to select.
   */
  async moveStatus(orderID: string, status: string): Promise<void> {
    await test.step(`Change Work Order Status to "${status}"`, async () => {
      await this.dropdown.selectDropdownByLocator(CommonLocators.moveStatusDropdownLocator(orderID), status);
      console.log(`Status change initiated for Work Order ${orderID} to "${status}"`);
    });
  }



/**
 * Cancel a work order using existing common action methods.
 *
 * Usage:
 *   await actions.cancelWorkOrder('Reason for cancellation');
 *
 * @param reason - Optional reason to input in the confirmation dialog.
 */
async cancelWorkOrder(reason?: string): Promise<void> {
  await test.step('Cancel Work Order', async () => {
    // Handle dialog input using existing method
    await this.modal.inputOnDialog(reason);

    // Click the "Cancel" button using existing method
    await this.actions.clickOnButton('Cancel');
    console.log('Cancel action initiated for Work Order');
  });
}



/**
 * Delay a work order by moving it through workflow steps.
 *
 * Usage:
 *   await actions.delayWorkOrder(workOrderId);
 *
 * @param workOrderId - The ID of the work order to delay.
 */
async delayWorkOrder(workOrderId: string): Promise<void> {
  await test.step(`Delay Work Order ${workOrderId}`, async () => {
    const dropdownLocator = `select[data-testid="moveStatus-${workOrderId}"]`;

    // Workflow steps: existing labels in dropdown
    const steps = ['Under Consideration', 'Pending Quote', 'Scheduled', 'Work In Progress', 'Delayed'];

    for (const step of steps) {
      await this.moveStatus(workOrderId, step);
    }
    console.log(`Work Order ${workOrderId} moved to "Delayed" status.`);
  });
}






}