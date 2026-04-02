import reporter from 'cucumber-html-reporter';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': 'Local',
    'Browser': process.env.BROWSER_TYPE || 'Chromium',
    'Headless Mode': 'No'
  }
};

try {
  reporter.generate(options);
  console.log('Report generated successfully');
} catch (err) {
  console.error('Error generating report:', err);
}