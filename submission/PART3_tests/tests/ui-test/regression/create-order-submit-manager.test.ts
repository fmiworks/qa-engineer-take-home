import { test } from '../../../src/fixtures/roles.fixture';

test.describe('Work Order Creation Tests', () => {

  test('TC-001 - Should Allow Submission With Only Required Fields', async ({ manager }) => {
    const { createWorkOrder, assertions } = manager;
    await createWorkOrder.create({
      shortDescription: 'Test Automation - Required Fields Only',
      site: 'Melbourne General Hospital',
      priority: 'Critical',
    });
    await assertions.assertToastMessage('Work order WO-');
    await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ created!/);
  });

  test('TC-002 - Work Order Appears On Table With Correct Details After Creation', async ({ managerWorkOrder }) => {
    const { workOrderId, submittedData, assertions } = managerWorkOrder;
    const { site, building, shortDescription: description, priority } = submittedData;
    await assertions.assertTableCellValue(workOrderId, 'WO Number', workOrderId);
    await assertions.assertTableCellValue(workOrderId, 'Location', `${site} → ${building}`);
    await assertions.assertTableCellValue(workOrderId, 'Description', description);
    await assertions.assertTableCellValue(workOrderId, 'Priority', priority);
    await assertions.assertTableCellValue(workOrderId, 'Status', 'New Request');
    await assertions.assertTextLinkVisible(workOrderId);
  });

  test('TC-003 - Should Be Able To Search The Work Order ID Created', async ({ managerWorkOrder }) => {
    const { workOrderId, assertions, actions } = managerWorkOrder;
    await actions.inputOnTextField('Search', workOrderId);
    await assertions.assertTextLinkVisible(workOrderId);
  });

  test('TC-004 - Should Be Open The Work Order Modal Upon Clicking The Work Order ID Created', async ({ managerWorkOrder }) => {
    const { workOrderId, assertions, actions } = managerWorkOrder;
    await assertions.assertTextVisible(workOrderId);
    await actions.clickTextLink(workOrderId);
    await assertions.assertTextVisible(workOrderId);
  });

});