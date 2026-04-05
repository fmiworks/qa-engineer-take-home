import { Page, test } from '@playwright/test';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { CommonUserActionsPage } from '../core/commonUserActionsPage';
import { DropdownComponent } from '../component/dropdownComponent';

export interface WorkOrderOptions {
  shortDescription?: string;
  fullDescription?: string;
  site?: string;
  building?: string;
  floor?: string;
  room?: string;
  priority?: string;
  source?: string;
}

const currentDateTime = DateTimeUtils.getCurrentDateTime();

const defaultOptions: WorkOrderOptions = {
  shortDescription: 'Test Automation - ' + currentDateTime,
  fullDescription: 'Test Automation Full - ' + currentDateTime,
  site: 'RANDOM',      // required
  priority: 'RANDOM',  // required
  building: 'RANDOM',  // optional
  floor: 'RANDOM',
  room: 'RANDOM',
  source: 'RANDOM'
};

export class CreateWorkOrderPage {
  private actions: CommonUserActionsPage;
  private dropdown: DropdownComponent;

  constructor(private page: Page) {
    this.actions = new CommonUserActionsPage(page);
    this.dropdown = new DropdownComponent(page);
  }

  // ----------------------------
  // Create with defaults + random values
  // ----------------------------
  /**
   * Create a work order using default values.
   * Dropdowns marked as 'RANDOM' will be automatically selected randomly.
   *
   * Usage:
   *   await createWorkOrderPage.createWithDefaults({ shortDescription: 'Test WO' });
   *
   * @param options - Optional fields to override defaults.
   * @returns The actual data submitted in the work order form.
   */
  async createWithDefaults(options: WorkOrderOptions = {}): Promise<WorkOrderOptions> {
    return await test.step('Create Work Order', async () => {
      await this.actions.selectTab('Create New');

      const dropdownFields = ['Site', 'Building', 'Floor', 'Room', 'Priority', 'Source'];
      const data: WorkOrderOptions = { ...defaultOptions, ...options };
      const submittedData: WorkOrderOptions = {};

      for (const [key, value] of Object.entries(data)) {
        const fieldLabel = this.formatFieldLabel(key);
        let actualValue: string | undefined;

        if (dropdownFields.includes(fieldLabel)) {
          if (value === 'RANDOM') {
            actualValue = await this.dropdown.selectRandomDropdownOption(fieldLabel);
          } else if (value === undefined) {
            continue;
          } else {
            await this.dropdown.selectDropdownOption(fieldLabel, value as string);
            actualValue = value as string;
          }
        } else if (value) {
          await this.actions.inputOnField(fieldLabel, value as string);
          actualValue = value as string;
        }

        if (actualValue) submittedData[key as keyof WorkOrderOptions] = actualValue;
      }

      await this.actions.clickOnButton('Create Work Order');

      console.log('Actual Submitted Work Order Data:', submittedData);
      return submittedData;
    });
  }

  // ----------------------------
  // Create without defaults, no random
  // ----------------------------
  /**
   * Create a work order using only the provided fields.
   * Does not fill any default values and does not select random dropdowns.
   *
   * Usage:
   *   await createWorkOrderPage.create({ shortDescription: 'Test WO', site: 'Hospital' });
   *
   * @param options - Fields to fill in the work order form.
   * @returns The actual data submitted in the work order form.
   */
  async create(options: WorkOrderOptions = {}): Promise<WorkOrderOptions> {
    return await test.step('Create Work Order Without Defaults', async () => {
      await this.actions.selectTab('Create New');

      const dropdownFields = ['Site', 'Building', 'Floor', 'Room', 'Priority', 'Source'];
      const submittedData: WorkOrderOptions = {};

      for (const [key, value] of Object.entries(options)) {
        if (value === undefined) continue;

        const fieldLabel = this.formatFieldLabel(key);

        if (dropdownFields.includes(fieldLabel)) {
          await this.dropdown.selectDropdownOption(fieldLabel, value as string);
        } else {
          await this.actions.inputOnField(fieldLabel, value as string);
        }

        submittedData[key as keyof WorkOrderOptions] = value as string;
      }

      await this.actions.clickOnButton('Create Work Order');

      console.log('Actual Submitted Work Order Data:', submittedData);
      return submittedData;
    });
  }

  // ----------------------------
  // Helper: convert camelCase keys to label format
  // ----------------------------
  /**
   * Converts a camelCase key to a user-friendly label format.
   * Example: shortDescription -> Short Description
   *
   * @param key - The camelCase key.
   * @returns The formatted label string.
   */
  private formatFieldLabel(key: string) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}