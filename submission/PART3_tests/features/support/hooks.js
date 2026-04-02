import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import fs from 'fs';
import { cleanupDirectories } from '../../utils/cleanup.js';
// Set default timeout to 5 minutes (30000000 milliseconds) for all steps
setDefaultTimeout(300000);

// Ensure the reports directory exists
BeforeAll(async function () {
  try {
    cleanupDirectories();
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', { recursive: true });
    }
    // Ensure we have write permissions
    fs.accessSync('reports', fs.constants.W_OK);
  } catch (error) {
    console.error('Error creating/accessing reports directory:', error);
    throw error;
  }
});

// Initialize the browser before each scenario
Before(async function (scenario) {
  // try {
  //   await this.init();
  // } catch (error) {
  //   console.error('Error in Before hook:', error);
  //   throw error;
  // }

  try {
    if (!scenario.pickle.name.includes('[RETRY]')) {
      this.retryAttempt = 0;
    }
    this.scenarioName = scenario?.pickle?.name || 'Unknown Scenario';
    this.tags = scenario.pickle.tags.map(t => t.name);
    console.log("Tag names are " + this.tags)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (this.tags.includes('@smoke')) {
      this.recordVideo = {
        dir: `reports/videos/${this.scenarioName}_${timestamp}/`
      }
    }
    await this.init();
    this.currentScenario = scenario;
    const scenarioName = scenario?.pickle?.name || 'Unknown Scenario';
    this.startTime = Date.now();

    if (this.retryAttempt > 0) {
      console.log(`:arrows_counterclockwise: Starting retry ${this.retryAttempt}/${this.maxRetries} for scenario: ${scenarioName}`);
    } else {
      console.log(`Starting scenario: ${scenarioName}`);
    }
  } catch (error) {
    console.error('Error in Before hook:', error);
    throw error;
  }

});

// Cleanup after each scenario
After(async function ({ result }) {
  try {
    // Handle failed scenarios
    if (result.status === 'FAILED') {
      console.log('='.repeat(50));
      console.log('TEST FAILURE DETECTED');
      console.log('='.repeat(50));
      // Take screenshot if scenario fails
      if (this.page) {
        try {
          const screenshotPath = `reports/failure-${Date.now()}.png`;
          const screenshot = await this.takeScreenshot(screenshotPath);
          if (screenshot) {
            await this.attach(screenshot, 'image/png');
            console.log(`📸 Screenshot saved: ${screenshotPath}`);
          }
        } catch (screenshotError) {
          console.error('Failed to take failure screenshot:', screenshotError);
        }
      }
      console.log('='.repeat(50));
    }

  } catch (error) {
    console.error('Error in After hook:', error);
  } finally {
    await this.cleanup();
  }
});