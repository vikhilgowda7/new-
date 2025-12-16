# Test Reporting Guide

This guide explains how to execute tests and view reports for passed and failed scenarios.

## Quick Start

### Local Execution

```bash
# Windows
scripts\run-tests.bat

# Linux/Mac
chmod +x scripts/run-tests.sh
./scripts/run-tests.sh
```

Or manually:

```bash
npm run test:ci
npm run report:merge
npm run report:open
```

## Understanding Reports

### Report Location

After test execution, find reports at:
- **HTML Report**: `cypress/reports/mochawesome-report/mochawesome.html`
- **JSON Report**: `cypress/reports/mochawesome.json`

### Report Contents

The HTML report includes:
1. **Summary Dashboard**
   - Total tests executed
   - Passed/Failed/Pending counts
   - Execution duration
   - Success rate percentage

2. **Test Suite Details**
   - Individual test case results
   - Pass/fail status for each test
   - Execution time per test
   - Error messages for failed tests

3. **Screenshots**
   - Automatically captured on test failures
   - Located in `cypress/screenshots/`

4. **Videos**
   - Full test execution videos
   - Located in `cypress/videos/`

### Reading the Report

#### Summary Section
- **Green badges**: Passed tests
- **Red badges**: Failed tests
- **Yellow badges**: Pending/skipped tests

#### Failed Test Details
Click on a failed test to see:
- Error message
- Stack trace
- Screenshot (if available)
- Command log showing what was executed

## CI/CD Execution

### GitHub Actions

When code is pushed to `main`, `master`, or `develop`:
1. Tests automatically execute
2. Reports are generated
3. Artifacts are uploaded

### Viewing CI/CD Reports

1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select the latest workflow run
4. Scroll down to **Artifacts** section
5. Download `cypress-html-report`
6. Extract and open `mochawesome.html`

### Failed Scenarios Tracking

In the HTML report:
1. Look for red status badges
2. Click on failed tests to see:
   - Exact error message
   - Which step failed
   - Screenshot of failure point
   - Expected vs Actual values

## Failed Scenarios Report

### Login Test Suite (`login1234.cy.js`)

The login test suite tracks failures internally:
- Failed scenarios are logged in the console
- Summary is shown at the end of test execution
- Each failure includes:
  - Test case number
  - Description
  - Error message
  - Timestamp

Check the test output or browser console for:
```
=== FAILED SCENARIOS ===
[Table showing all failed test cases]
```

## Customizing Reports

### Changing Report Format

Edit `cypress.config.js` or `package.json` scripts to use different reporters:

```json
{
  "scripts": {
    "test:ci": "cypress run --reporter mochawesome --reporter-options reportDir=cypress/reports"
  }
}
```

### Report Options

Available options in `test:ci` script:
- `reportDir`: Directory for reports
- `overwrite`: Overwrite existing reports (true/false)
- `html`: Generate HTML report (true/false)
- `json`: Generate JSON report (true/false)

## Troubleshooting Reports

### Reports Not Generated

```bash
# Clean and regenerate
npm run clean:reports
npm run test:ci
npm run report:merge
```

### Missing Screenshots/Videos

Ensure in `cypress.config.js`:
```javascript
video: true,
screenshotOnRunFailure: true,
```

### Viewing JSON Report

The JSON report contains machine-readable data:
```bash
cat cypress/reports/mochawesome.json
```

## Automated Email Reports (Optional)

You can extend the CI/CD workflow to send email reports:

1. Add email action to `.github/workflows/cypress-tests.yml`
2. Configure SMTP settings
3. Attach HTML report

## Best Practices

1. **Always check reports after deployment**
2. **Review failed test screenshots** to understand issues
3. **Check console logs** for detailed error messages
4. **Update test data** if CSV files need changes
5. **Fix failing tests** before next deployment

## Report Metrics

Track these metrics over time:
- Test execution time
- Pass/fail ratio
- Most common failure points
- Flaky tests identification


