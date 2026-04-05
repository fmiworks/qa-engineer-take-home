import { test as base, Page, Browser, expect } from '@playwright/test';
import { ModalComponent } from '../component/modalComponent';
import { DropdownComponent } from '../component/dropdownComponent';
import { CommonUserActionsPage } from '../core/commonUserActionsPage';
import { CommonAssertionsPage } from '../core/commonAssertionsPage';
import { WorkOrderOptions, CreateWorkOrderPage } from '../pages/createWorkOrderPage';
import { WorkOrderPage } from '../pages/workOrderPage';

type RoleFixture = {
  page: Page;
  actions: CommonUserActionsPage;
  assertions: CommonAssertionsPage;
  createWorkOrder: CreateWorkOrderPage;
  workOrderPage: WorkOrderPage;
  modal: ModalComponent;
  dropdown: DropdownComponent;
};

type RoleWithWorkOrderFixture = RoleFixture & {
  workOrderId: string;
  submittedData: WorkOrderOptions;
};

type Fixtures = {
  manager: RoleFixture;
  managerWorkOrder: RoleWithWorkOrderFixture;
  coordinator: RoleFixture;
  stakeholder: RoleFixture;
  worker: RoleFixture;
  supplier: RoleFixture;
};

// ========== Centralized role factory ==========
async function createRoleFixture(browser: Browser, role: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/');
  await page.selectOption('#roleSelect', role);

  const fixture: RoleFixture = {
    page,
    actions: new CommonUserActionsPage(page),
    assertions: new CommonAssertionsPage(page),
    createWorkOrder: new CreateWorkOrderPage(page),
    workOrderPage: new WorkOrderPage(page),
    modal: new ModalComponent(page),
    dropdown: new DropdownComponent(page),
  };

  return { fixture, context };
}

// ========== Playwright test extension ==========
export const test = base.extend<Fixtures>({

  // Manager
  manager: async ({ browser }, use) => {
    const { fixture, context } = await createRoleFixture(browser, 'manager');
    await use(fixture);
    await context.close();
  },

  // Manager with pre-created work order
  managerWorkOrder: async ({ manager }, use) => {
    const submittedData = await manager.createWorkOrder.createWithDefaults({});
    const toastMessage = await manager.actions.getWorkOrderToastMessage();

    if (!toastMessage?.workOrder) {
      throw new Error('Failed to retrieve work order ID from toast.');
    }

    await use({
      ...manager,
      workOrderId: toastMessage.workOrder,
      submittedData,
    });
  },

  // Coordinator
  coordinator: async ({ browser }, use) => {
    const { fixture, context } = await createRoleFixture(browser, 'coordinator');
    await use(fixture);
    await context.close();
  },

  // Stakeholder
  stakeholder: async ({ browser }, use) => {
    const { fixture, context } = await createRoleFixture(browser, 'stakeholder');
    await use(fixture);
    await context.close();
  },

  // Worker
  worker: async ({ browser }, use) => {
    const { fixture, context } = await createRoleFixture(browser, 'works-user');
    await use(fixture);
    await context.close();
  },

  // Supplier
  supplier: async ({ browser }, use) => {
    const { fixture, context } = await createRoleFixture(browser, 'supplier');
    await use(fixture);
    await context.close();
  },
});

export { expect };