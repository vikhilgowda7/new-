# CI/CD Setup Guide - Automated Test Execution on Deployment

## Overview

This guide explains how to set up automated Cypress test execution when new code is deployed and how to view test reports showing passed and failed scenarios.

## ✅ What's Been Set Up

1. **GitHub Actions Workflow** (`.github/workflows/cypress-tests.yml`)
   - Automatically runs tests on code push
   - Generates HTML and JSON reports
   - Uploads reports as downloadable artifacts

2. **Test Reporter** (Mochawesome)
   - Beautiful HTML reports with pass/fail status
   - Screenshot capture on failures
   - Video recordings of test execution

3. **NPM Scripts** (in `package.json`)
   - `npm run test:ci` - Run tests and generate reports
   - `npm run report:merge` - Merge and generate HTML report
   - `npm run report:open` - Open report in browser

4. **Helper Scripts**
   - `scripts/run-tests.bat` - Windows test execution script
   - `scripts/run-tests.sh` - Linux/Mac test execution script

## 🚀 How It Works

### Automatic Execution

When you push code to GitHub:
1. GitHub Actions detects the push
2. Runs Cypress tests automatically
3. Generates test reports
4. Uploads reports as artifacts

### Manual Execution

Run tests manually anytime:
```bash
# Windows
scripts\run-tests.bat

# Or via npm
npm run test:ci
npm run report:merge
npm run report:open
```

## 📊 Viewing Test Reports

### Option 1: GitHub Actions (CI/CD)

1. Go to your GitHub repository
2. Click **Actions** tab
3. Find the latest workflow run (look for "Cypress Tests on Deployment")
4. Click on it to see execution details
5. Scroll to **Artifacts** section at the bottom
6. Download `cypress-html-report`
7. Extract the ZIP file
8. Open `mochawesome.html` in your browser

### Option 2: Local Execution

1. Run tests: `npm run test:ci`
2. Generate report: `npm run report:merge`
3. Open report: `npm run report:open`
4. Or manually open: `cypress/reports/mochawesome-report/mochawesome.html`

## 📋 Understanding the Report

### Summary Section

The report shows:
- ✅ **Passed Tests** - Green badges
- ❌ **Failed Tests** - Red badges  
- ⏸️ **Pending Tests** - Yellow badges
- 📊 **Success Rate** - Percentage
- ⏱️ **Execution Time** - Total duration

### Failed Test Details

Click on any failed test to see:
- **Error Message** - What went wrong
- **Stack Trace** - Where it failed
- **Screenshot** - Visual of failure point
- **Command Log** - Step-by-step execution
- **Expected vs Actual** - Value comparisons

### Failed Scenarios from CSV Tests

For `login1234.cy.js` (data-driven tests):
- Failed scenarios are logged in the console during execution
- Check browser console (F12) for a table of failed scenarios
- Each failure includes:
  - Test case number
  - Description
  - Error message
  - Timestamp

## 🔧 Configuration

### Changing Trigger Branches

Edit `.github/workflows/cypress-tests.yml`:

```yaml
on:
  push:
    branches:
      - main
      - develop
      - your-branch-name  # Add your branch
```

### Running Tests on Deployment Events

The workflow already includes `deployment_status` trigger. To use it:

1. Set up deployment workflows that create deployment events
2. Tests will automatically run when deployments occur

### Running Specific Test Files

```bash
# Run single test file
npm run test:spec "cypress/e2e/login1234.cy.js"

# Run multiple files
npm run test:spec "cypress/e2e/login*.cy.js"
```

## 📧 Email Notifications (Optional)

To receive email notifications of test results:

1. Add email action to `.github/workflows/cypress-tests.yml`
2. Configure SMTP settings in GitHub Secrets
3. Attach HTML report to email

Example addition to workflow:

```yaml
- name: Send email report
  uses: dawidd6/action-send-mail@v3
  if: always()
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: "Cypress Test Results - ${{ github.ref_name }}"
    body: "Test execution completed. Download artifacts to view reports."
    attachments: cypress/reports/mochawesome-report/mochawesome.html
```

## 🐛 Troubleshooting

### Tests Don't Run Automatically

1. Check workflow file exists: `.github/workflows/cypress-tests.yml`
2. Verify branch name matches trigger branches
3. Check GitHub Actions tab for workflow runs
4. Look for any workflow errors

### Reports Not Generated

```bash
# Clean and regenerate
npm run clean:reports
npm run test:ci
npm run report:merge
```

### Can't Download Artifacts

1. Make sure workflow completed (even if tests failed)
2. Artifacts are available for 30 days
3. Check file size limits (GitHub has limits)

### Local vs CI Differences

If tests pass locally but fail in CI:
1. Check environment differences
2. Review screenshots/videos in artifacts
3. Verify timeout values
4. Check for flaky tests

## 📈 Best Practices

1. **Always review reports after deployment**
2. **Fix failing tests before next deployment**
3. **Track metrics over time** (pass rate, execution time)
4. **Keep test data (CSV) updated**
5. **Document known issues** in test descriptions

## 🔗 Useful Links

- Cypress Dashboard: https://dashboard.cypress.io (Optional - for advanced tracking)
- GitHub Actions Docs: https://docs.github.com/en/actions
- Mochawesome Docs: https://github.com/adamgruber/mochawesome

## 📝 Next Steps

1. **Push code to GitHub** - Workflow will run automatically
2. **Check Actions tab** - Verify tests are running
3. **Download artifacts** - View test reports
4. **Fix any failures** - Update tests or application
5. **Iterate** - Continuous improvement

## Summary

✅ **Automatic execution** - Tests run on code push  
✅ **Beautiful reports** - HTML reports with pass/fail details  
✅ **Easy access** - Download artifacts from GitHub Actions  
✅ **Failed scenario tracking** - Clear identification of failures  
✅ **Screenshots & Videos** - Visual evidence of failures  

Your CI/CD pipeline is now ready! 🎉


