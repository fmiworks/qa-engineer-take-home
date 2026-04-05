import { test } from '../../../src/fixtures/roles.fixture';

test.describe('Work Order Form Role Access Tests', () => {

  test('[TC-001] - Should Not Allow Worker To Access Work Order Form', async ({ worker }) => {
    const { assertions } = worker;
    await assertions.assertTabNotVisible('Create New');
  });

  test('[TC-002] - Should Not Allow Supplier To Access Work Order Form', async ({ supplier }) => {
    const { assertions } = supplier;
    await assertions.assertTabNotVisible('Create New');
  });

  test('[TC-003] - Should Allow Coordinator To Create Work Order', async ({ coordinator }) => {
    const { createWorkOrder, assertions } = coordinator;
    await createWorkOrder.create({
      shortDescription: 'Test Automation - Required Fields Only',
      site: 'Melbourne General Hospital',
      priority: 'Critical',
    });
    await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ created!/);
  });

  test('[TC-004] - Should Allow Stakeholder To Create Work Order', async ({ stakeholder }) => {
    const { createWorkOrder, assertions } = stakeholder;
    await createWorkOrder.create({
      shortDescription: 'Test Automation - Required Fields Only',
      site: 'Melbourne General Hospital',
      priority: 'Critical',
    });
    await assertions.assertToastMessage(/Work order WO-\d{4}-\d+ created!/);
  });

});