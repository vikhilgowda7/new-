# ForestStack Cypress Automation Framework

This repository contains Cypress end-to-end automation tests for the ForestStack application.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Running Tests

### Local Development

```bash
# Open Cypress Test Runner (Interactive Mode)
npm run test:open

# Run all tests in headless mode
npm run test:headless

# Run specific test file
npm run test:spec "cypress/e2e/login1234.cy.js"
```

### CI/CD Execution

```bash
# Run tests with HTML report generation
npm run test:ci

# Generate and merge reports
npm run report:merge

# Open HTML report in browser
npm run report:open
```

## Test Reports

After running tests, reports are generated in the `cypress/reports/` directory:

- **HTML Report**: `cypress/reports/mochawesome-report/mochawesome.html`
- **JSON Report**: `cypress/reports/mochawesome.json`

### Viewing Reports Locally

```bash
# After running tests, open the HTML report
npm run report:open
```

### Reports in CI/CD

When tests run in GitHub Actions:
1. HTML reports are uploaded as artifacts
2. Download artifacts from the Actions tab
3. Open `cypress/reports/mochawesome-report/mochawesome.html` to view results

## CI/CD Integration

### GitHub Actions

Tests automatically run on:
- Push to `main`, `master`, or `develop` branches
- Manual trigger via GitHub Actions UI
- Deployment events (configurable)

### Workflow Location

The CI/CD workflow is located at: `.github/workflows/cypress-tests.yml`

### Viewing Results

1. Go to the **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Download the `cypress-html-report` artifact
4. Extract and open `mochawesome.html` in your browser

## Test Files

- `login1234.cy.js` - Combined login test suite (data-driven from CSV)
- `cat_test_5.cy.js` - Dataset collection page tests
- `cat_test_6.cy.js` - Models collection page tests
- `test_1.cy.js` through `test_4.cy.js` - Individual login test cases

## Test Data

Test data is stored in CSV format:
- `cypress/fixtures/login_test_data.csv` - Login test scenarios

## Project Structure

```
cypress/
├── e2e/              # Test files
├── fixtures/         # Test data (CSV, JSON)
├── support/          # Custom commands and configurations
├── screenshots/      # Screenshots on test failure
├── videos/           # Video recordings of test runs
└── reports/          # Test execution reports
```

## Continuous Integration

### Setting Up GitHub Actions

1. Push this repository to GitHub
2. The workflow file (`.github/workflows/cypress-tests.yml`) will automatically run on:
   - Code pushes to main/master/develop branches
   - Manual triggers
   - Deployment events

### Customizing CI/CD

Edit `.github/workflows/cypress-tests.yml` to:
- Change trigger branches
- Add environment variables
- Configure different test suites
- Integrate with deployment pipelines

## Troubleshooting

### Tests Fail in CI but Pass Locally

1. Check viewport settings
2. Verify timeout values
3. Check for environment-specific issues
4. Review screenshots and videos in artifacts

### Report Generation Issues

```bash
# Clean old reports and regenerate
npm run clean:reports
npm run test:ci
npm run report:merge
```

## Contributing

1. Write tests following existing patterns
2. Use CSV files for data-driven tests
3. Add proper error handling and logging
4. Update this README if adding new features

## Support

For issues or questions, please check:
- Cypress documentation: https://docs.cypress.io
- Mochawesome documentation: https://github.com/adamgruber/mochawesome


