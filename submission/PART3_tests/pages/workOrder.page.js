// import { expect } from 'chai';
import { expect } from '@playwright/test';
import config from '../configs/config.js';
import { DialogHelper } from '../utils/dialogHelper.js';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.dialogHelper = new DialogHelper(page);
    this.selectRolesOption = page.locator("#roleSelect");
    this.selectFirstWO = page.locator("a[class='wo-link']");
    this.deleteWorkOrder = page.locator("button[id='deleteWoBtn']");
    this.woOrderDeletedAlert = page.locator("[id='toast']");

    //Priorities Filter
    this.selectPrioritiesOption = page.locator("#filterPriority");
    this.priorityBadge = page.locator(".priority-badge");

    //Assign user to work order
    this.assignButton = page.locator(".action-assign");
    this.assignedToBadge = page.locator("//span[contains(@class,'status-badge')]/following::td");
    this.woOrderAssignedAlert = page.locator("[id='toast']");

    //WO - Status
    this.workOrderStatusBadge = page.locator(".status-badge");
    this.transitionToStateOptions = page.locator(".action-status");
    this.transitionStateFeature = page.locator("//span[contains(@class,'status-completed')]/parent::td/following-sibling::td/following-sibling::td/following-sibling::td");

  }

  async navigate() {
    await this.page.goto(config.FMIWorksUrlBaseUrl);
  }

  async selectRole(role) {
    await this.selectRolesOption.selectOption({ value: role });
    await this.page.waitForTimeout(5000);
  }

  async selectWorkOrder() {
    await this.selectFirstWO.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.selectFirstWO.first().click();
    await this.page.waitForTimeout(2000);
  }

  async deleteCreatedWorkOrder() {
    await this.deleteWorkOrder.waitFor({ state: 'visible', timeout: 5000 });
    await this.deleteWorkOrder.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
    await this.dialogHelper.handleDialogWithClick(this.deleteWorkOrder);
  }

  async deleteWorkOrderMessage() {
    await this.woOrderDeletedAlert.waitFor({ state: 'visible', timeout: 5000 });
    await expect(this.woOrderDeletedAlert).toHaveText('Work order deleted');
  }

  async selectPriority(priority) {
    await this.selectPrioritiesOption.selectOption({ value: priority });
    await this.page.waitForTimeout(1000);
  }

  async verifyPriorityBadge(expectedPriority) {
    const badges = this.priorityBadge;
    await badges.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toHaveText(expectedPriority);
    }
  }

  async assignUserToWorkOrder() {
    await this.assignButton.first().waitFor({ state: 'visible', timeout: 5000 });

    const randomNumber = Math.floor(Math.random() * 6) + 1;
    console.log('Selected user:', randomNumber);

    await this.dialogHelper.handleDialogWithClick(this.assignButton.first(), randomNumber);
  }

  async verifyAssignedToBadge() {
    await this.assignedToBadge.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(1000);
    const assignToPerson = await this.assignedToBadge.first().textContent();
    await expect(this.woOrderAssignedAlert).toContainText(`assigned to ${assignToPerson}`);
    console.log('Assigned to:', assignToPerson);
  }

  async transitionToState(transitions) {
    await this.transitionToStateOptions.first().selectOption({ value: transitions });
    await this.page.waitForTimeout(2000);
  }

  async verifyWorkOrderStatus(status) {
    const currentStatus = await this.workOrderStatusBadge.first().textContent();
    await expect(currentStatus).toBe(status);
    console.error('Work Order Status actual: ', currentStatus, ' And expected result is: ', status);
    await this.page.waitForTimeout(1000);
  }

  async addActionTakenComment(text, transitions) {
    await this.dialogHelper.handleDialogWithSelectOption(
      this.transitionToStateOptions.first(),
      { value: transitions },
      text
    );
  }

  async transitionStateNotVisible() {
    await this.transitionStateFeature.first().waitFor({ state: 'visible', timeout: 5000 });
    const textContent = await this.transitionStateFeature.first().textContent();
    console.log('Transition state feature text:', textContent);
    await expect(textContent.trim()).toBe('');
    console.log('Transition state feature text is empty:', textContent);
  }

}