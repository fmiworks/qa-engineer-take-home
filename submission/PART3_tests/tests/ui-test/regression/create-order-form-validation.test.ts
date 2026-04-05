import { test } from '../../../src/fixtures/roles.fixture';

test.describe('Work Order Form Validation Tests', () => {

  test('[TC-001] - Should Not Allow Submission With Missing Short Description Required Field', async ({ manager }) => {
    const { createWorkOrder, assertions } = manager;
    await createWorkOrder.create({
      site: 'Melbourne General Hospital',
      priority: 'Critical',
    });
    await assertions.assertTextVisible('Short Description is required.');
    await assertions.assertToastMessage('Work order NOT created!');
  });

  test('[TC-002] - Should Not Allow Submission With Missing Site Required Field', async ({ manager }) => {
    const { createWorkOrder, assertions } = manager;
    await createWorkOrder.create({
      shortDescription: 'Test Automation - Missing Field',
      priority: 'Critical',
    });
    await assertions.assertTextVisible('Site is required.');
    await assertions.assertToastMessage('Work order NOT created!');
  });

  test('[TC-003] - Should Not Allow Submission With Missing Priority Required Field', async ({ manager }) => {
    const { createWorkOrder, assertions } = manager;
    await createWorkOrder.create({
      shortDescription: 'Test Automation - Missing Field',
      site: 'Melbourne General Hospital',
    });
    await assertions.assertTextVisible('Priority is required.');
    await assertions.assertToastMessage('Work order NOT created!');
  });

  test('[TC-004] - Should Not Allow Submission With Missing All Required Fields', async ({ manager }) => {
    const { createWorkOrder, assertions } = manager;
    await createWorkOrder.create({});
    await assertions.assertErrorMessageVisible('Short Description is required.');
    await assertions.assertErrorMessageVisible('Site is required.');
    await assertions.assertErrorMessageVisible('Priority is required.');
    await assertions.assertToastMessage('Work order NOT created!');
  });

});