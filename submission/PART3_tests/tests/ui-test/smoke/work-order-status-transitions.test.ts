import { test } from '../../../src/fixtures/roles.fixture';

test.describe('Manager Work Order Actions', () => {

  test.beforeEach(async ({ managerWorkOrder }) => {
    const { workOrderId, actions } = managerWorkOrder;
    await actions.inputOnTextField('Search', workOrderId);
  });

  test('[TC-001] - Should Allow Manager To Cancel Work Order', async ({ managerWorkOrder }) => {
    const { workOrderId, workOrderPage, assertions } = managerWorkOrder;
    await workOrderPage.cancelWorkOrder('Test cancel by manager');
    await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ cancelled/);
    await assertions.assertTableCellValue(workOrderId, 'Status', 'Cancelled');
  });

  test('[TC-002] - Should Allow Manager To Delay Work Order', async ({ managerWorkOrder }) => {
    const { workOrderId, workOrderPage, assertions } = managerWorkOrder;
    await workOrderPage.delayWorkOrder(workOrderId);
    await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ moved to Delayed/);
    await assertions.assertTableCellValue(workOrderId, 'Status', 'Delayed');
  });

  test('[TC-012] - Should Verify Cascading Dropdown Options', async ({ managerWorkOrder }) => {
    const { workOrderId, workOrderPage, assertions } = managerWorkOrder;
    await workOrderPage.moveStatus(workOrderId, 'Under Consideration');
    await assertions.assertDropdownOnlyOptions(workOrderId, ['Pending Quote']);
    await workOrderPage.moveStatus(workOrderId, 'Pending Quote');
    await assertions.assertDropdownOnlyOptions(workOrderId, ['Scheduled']);
    await workOrderPage.moveStatus(workOrderId, 'Scheduled');
    await assertions.assertDropdownOnlyOptions(workOrderId, ['Work In Progress']);
    await workOrderPage.moveStatus(workOrderId, 'Work In Progress');
    await assertions.assertDropdownOnlyOptions(workOrderId, ['Completed', 'Delayed']);
    await workOrderPage.moveStatus(workOrderId, 'Delayed');
    await assertions.assertDropdownOnlyOptions(workOrderId, ['Work In Progress']);
    await workOrderPage.moveStatus(workOrderId, 'Work In Progress');
    await assertions.assertDropdownOnlyOptions(workOrderId, ['Completed', 'Delayed']);
    await workOrderPage.moveStatus(workOrderId, 'Completed');
  });

  // Multiple test case IDs in one test to cover the full workflow and reduce test execution time.
  test('[TC-003][TC-004][TC-005][TC-006][TC-007] - Should Complete Full Work Order Status Workflow', async ({ managerWorkOrder }) => {
    const { workOrderId, actions, assertions, workOrderPage, modal } = managerWorkOrder;

    await test.step('[TC-003] - Move Work Order to Under Consideration', async () => {
      await workOrderPage.moveStatus(workOrderId, 'Under Consideration');
      await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ moved to Under Consideration/);
      await assertions.assertTableCellValue(workOrderId, 'Status', 'Under Consideration');
    });

    await test.step('[TC-004] - Move Work Order to Pending Quote', async () => {
      await workOrderPage.moveStatus(workOrderId, 'Pending Quote');
      await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ moved to Pending Quote/);
      await assertions.assertTableCellValue(workOrderId, 'Status', 'Pending Quote');
    });

    await test.step('[TC-005] - Move Work Order to Scheduled', async () => {
      await workOrderPage.moveStatus(workOrderId, 'Scheduled');
      await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ moved to Scheduled/);
      await assertions.assertTableCellValue(workOrderId, 'Status', 'Scheduled');
    });

    await test.step('[TC-006] - Move Work Order to Work In Progress', async () => {
      await workOrderPage.moveStatus(workOrderId, 'Work In Progress');
      await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ moved to Work In Progress/);
      await assertions.assertTableCellValue(workOrderId, 'Status', 'Work In Progress');
    });

    await test.step('[TC-007] - Move Work Order to Completed', async () => {
      await modal.inputOnDialog('Test completion by manager');
      await workOrderPage.moveStatus(workOrderId, 'Completed');
      await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ moved to Completed/);
      await assertions.assertTableCellValue(workOrderId, 'Status', 'Completed');
    });

  });

});