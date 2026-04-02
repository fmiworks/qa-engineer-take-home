import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../pages/workOrder.page.js';
/** @type {LoginPage} */
let loginPage;

Given('Navigate to the FMI Works application', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  await this.page.waitForTimeout(4000);
});

When('User select the role as {string}', async function (role) {
  await loginPage.selectRole(role);
  await this.page.waitForTimeout(2000);
});

When('User clicks on the work order to delete', async function () {
  await loginPage.selectWorkOrder();
  await loginPage.deleteCreatedWorkOrder();
  await this.page.waitForTimeout(1000);
});

Then('User should see a confirmation message', async function () {
  await loginPage.deleteWorkOrderMessage();
  await this.page.waitForTimeout(1000);
});

When('User select the priority option {string}', async function (priority) {
  await loginPage.selectPriority(priority);
  await this.page.waitForTimeout(1000);
});

Then('only the {string} Work Orders should be displayed', async function (expectedPriority) {
  await loginPage.verifyPriorityBadge(expectedPriority);
  await this.page.waitForTimeout(1000);
});

When('Manager assigns the user to work order', async function () {
  await loginPage.assignUserToWorkOrder();
  await this.page.waitForTimeout(1000);
});

Then('Work Order should be successfully assigned to the user', async function () {
  await loginPage.verifyAssignedToBadge();
  await this.page.waitForTimeout(1000);
});

When('User transitions to {string}', async function (transitions) {
  await loginPage.transitionToState(transitions);
  await this.page.waitForTimeout(1000);
});

Then('The work order status should be {string}', async function (status) {
  await loginPage.verifyWorkOrderStatus(status);
  await this.page.waitForTimeout(1000);
});

When('User describe the action taken {string} and transitions to {string}', async function (text, transitions) {
  await loginPage.addActionTakenComment(text, transitions);
  await this.page.waitForTimeout(1000);
});

Then('Transition status should not be visible', async function () {
  await loginPage.transitionStateNotVisible();
  await this.page.waitForTimeout(1000);
});
