## Part 1: Review the Existing Test Suites (written)

### Problem 1: Base URL is hardcoded
`const BASE_URL = 'http://localhost:3000';`

Why it matters:
- Cannot reuse across different test environments e.g DEV, QA, STAGING
- Hard to switch environments, need to modify the code every time you switch environments 
- Not CI ready

What you'd do differently:
- Make base URL configurable using environment variables
- Declare it in the Playwright config file


### Problem 2: Use of hardcoded waitForTimeout
`await page.waitForTimeout(1000);`

Why it matters:
- Causes flaky tests — pass or fail depends on site performance
- Slows down test execution — even if page is ready earlier still waits
- Unreliable in CI environments — CI machines are usually slower

What you'd do differently:
- Use assertion-based waiting, Playwright has auto wait for elements to be actionable  
- Example: `await expect(page.locator('#toast')).toBeVisible();`


### Problem 3: Weak Assertions
`expect(count).toBeGreaterThan(0);`

Why it matters:
- Can cause false positives
- May not completely verify the acceptance criteria of the test case

What you'd do differently:
- Use stronger assertions by verifying specific audit log entry  
- Example: `await expect(page.locator('.audit-entry')).toHaveText('Emily Parker — Created work order');`


### Problem 4: Hardcoded Test Data
Using same test data across tests

Why it matters:
- Fails when other users modify data
- Not isolated, conflicts when running tests in parallel
- Not ready to run in other environments without test data

What you'd do differently:
- Automatically generate dynamic test data for each test run 


### Problem 5: Test names are written in all lowercase but describe is in Title Case
Makes test reports harder to scan, especially when there are many tests

Why it matters:
- Easier to read and understand
- Looks formal and professional
- Visually clearer and stands out in reports

What you'd do differently:
- Use Title Case in both test case and describe names
- Include test case IDs for traceability


### Problem 6: Helper functions inside test file

Why it matters:
- Poor maintainability
- Hard to scale
- Violates separation of concerns

What you'd do differently:
- Use Page Object Model


### Problem 7: Repeated login step

Why it matters:
- Duplicate code
- Slow tests
- Hard to maintain

What you'd do differently:
- Implement login using fixtures
- Use global setup
- Use auth storage state
