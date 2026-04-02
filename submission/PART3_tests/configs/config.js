import dotenv from 'dotenv';
dotenv.config();
import environmentConfig from './environment.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = {

    FMIWorksUrlBaseUrl: environmentConfig.fmiWorksUrl,


    browser: {
        headless: process.env.HEADLESS !== 'false',
        slowMo: parseInt(process.env.SLOW_MO || '0'),
        timeout: parseInt(process.env.TIMEOUT || '2400000')
    },
    reporter: [
        ['list'],
        [path.resolve(__dirname, '../helpers/smokeReporter'), {}],
        ['html', { outputFolder: path.resolve(__dirname, '../smoke-playwright-report') }],
        ['json', { outputFile: path.resolve(__dirname, '../smoke-playwright-report/smoke-report.json') }]
    ]
};

export default config;