# QA Automation & Analysis Exercise

**Role:** QA Engineer — FMI Software
**Time allowed:** 3–4 hours (untimed, but we expect roughly this level of effort)

---

## Context

FMI Works is a SaaS platform for facilities and asset management used by hospitals, schools, and aged-care providers across Australia and New Zealand. Compliance and audit trails are critical.

You've been given a **simplified Work Order management app** and **two pre-written test suites** (Playwright and Cypress). The app simulates the core workflow: creating work orders, transitioning statuses, assigning to suppliers/employees, and managing work orders across different user roles.

### Key Domain Rules

- Work orders move through a defined status workflow: `New Request → Under Consideration → Pending Quote → Scheduled → Work In Progress → Completed`. Additional statuses: `Cancelled`, `Delayed`.
- Work orders are created at a **Location** (Site → Building → Floor → Room).
- Work orders can be assigned to **suppliers** (external contractors) or **employees** (internal staff).
- Different **roles** have different permissions (Coordinator, Manager, Stakeholder, Works User, Supplier).
- All status changes must be recorded in an **audit log**.
- Work orders use **soft deletes** (a `lifecycle` flag) — they should never be hard-deleted from the data store.
- External identifiers should use **UUIDs**; internal integer IDs should not be exposed to users.

### Tech Stack

| Layer | Technology |
|-------|------------|
| App | Static HTML + vanilla JavaScript (single-page) |
| Test suites provided | Playwright (TypeScript), Cypress (JavaScript) |
| Your tests | Use **any** JavaScript/TypeScript framework you're comfortable with |

---

## Setup

### Running the App

Open `app/index.html` directly in your browser, or serve it locally:

```bash
npx serve app
```

Then navigate to `http://localhost:3000`.

### Exploring the App

Use the **role switcher** in the header to switch between user roles and observe how the UI changes. The app has seeded data with work orders in various statuses.

---

## What You Need to Deliver

This exercise has **four parts**. We value quality of thinking over volume of output.

### Part 1: Review the Existing Test Suites (written)

Both test suites (`tests/playwright/workorder.spec.ts` and `tests/cypress/workorder.cy.js`) contain **deliberate flaws** — bugs, poor practices, missing coverage, incorrect assertions, and fragile patterns.

Review **both** suites and document your findings. For each issue, describe:
- What the problem is
- Why it matters (flaky tests? false positives? missing coverage?)
- What you'd do differently

You don't need to fix the code — we want to see your analytical eye.

### Part 2: Plan Additional Test Coverage (written)

The existing suites cover a fraction of what this app needs. Write a **test coverage plan** describing what additional tests you would add. Organise your plan by area (e.g., creation, status transitions, permissions, UI behaviour) and indicate priority.

Focus on:
- Edge cases and negative scenarios
- Role-based access control
- Data integrity (soft deletes, audit trail)
- UI/UX behaviour (cascading dropdowns, filters, modals)

### Part 3: Write New Tests (code)

Pick **3–5 of your highest-priority test cases** from Part 2 and implement them. Use whichever framework you prefer (Playwright, Cypress, WebdriverIO, or another JavaScript/TypeScript framework).

We're looking for:
- Clean, maintainable test code
- Good selector strategy
- Proper assertions (not just status codes — verify behaviour)
- At least one helper/utility function
- Tests that would actually catch real bugs

### Part 4: Bug Reports (written)

As you explore the app, you'll find **UI bugs and behavioural issues**. File **3–5 bug reports** using a format of your choice. Good bug reports include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behaviour
- Severity/priority assessment
- Screenshots if relevant

---

## Evaluation Criteria

| Criterion | Weight | What we're looking for |
|-----------|--------|----------------------|
| Test review quality | 25% | Can you identify real issues in existing tests and explain why they matter? |
| Coverage thinking | 25% | Do you think about edge cases, security, compliance, and data integrity? |
| Code quality | 20% | Are your new tests clean, maintainable, and reliable? |
| Bug identification | 15% | Can you find real defects through exploratory testing? |
| Communication | 15% | Are your written deliverables clear, well-structured, and actionable? |

---

## Submission

Organise your deliverables clearly. We suggest:

```
submission/
├── PART1_test_review.md          # Your review of the existing test suites
├── PART2_coverage_plan.md        # Your additional test coverage plan
├── PART3_tests/                  # Your new automated tests
│   ├── [your test files]
│   └── README.md                 # How to run your tests
└── PART4_bug_reports.md          # Your bug reports
```

Fork or clone this repository, create a new branch for your work (e.g., `yourname/qa-submission`), and open a **pull request to `main`** when you're done. Share the PR link with our team.

---

## Tips

- **Don't try to automate everything.** A few well-written tests are worth more than many shallow ones.
- **The app has planted bugs.** Finding them through exploration is part of the exercise — some are subtle.
- **Show your reasoning.** We care more about *why* you'd test something than *that* you listed it.
- **Quality over quantity.** In every part.

Good luck.
