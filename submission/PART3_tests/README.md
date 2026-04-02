# Test Automation Project

This project contains automated tests using Playwright and Cucumber.js.

---

# Prerequisites

Before running the tests, make sure you have the following installed:

- Node.js (latest LTS version)
- npm (comes with Node.js)
- Cucumber (latest version)

---

# Installation

1. Install project dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Install Cucumber:
```bash
npm install @cucumber/cucumber@latest
npm install --save-dev multiple-cucumber-html-reporter
```
---

# Running Tests

**Note:** Before running tests, start the server first:

```bash
npx serve app -p 3000
```

## Running Tests in Different Environments

You can run tests in different environments by setting the `TEST_ENV` variable:

```bash
# Set environment
$env:TEST_ENV="<environment_name>"

# Run all tests
npm run test

# Run specific tagged tests
npm run test:tag "<tag_name>"
```

### Run in One Line

```bash
$env:TEST_ENV="<environment_name>"; npm run test:tag "<tag_name>"
```

### Environment Examples

```bash
$env:TEST_ENV="preprod"; npm run test
$env:TEST_ENV="staging"; npm run test:tag "@smoke"
```

---

## Run All Tests

```bash
npm run test
```

---

## Run Tests by Tag

### Using npm script:
```bash
npm run test:tag "@your-tag"
npm run test:tag "@smoke"
```

### Using Cucumber directly:
```bash
npx cucumber-js --tags "@your-tag"
```

---

## Run Parallel Tests

```bash
$env:TEST_ENV="ENV Name"; npx cucumber-js --tags "@smoke or @regression" --parallel 4
```

---

# Clean Project

```bash
npm run clean
```

---

# Generate Test Report

```bash
npm run report
```