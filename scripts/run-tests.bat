@echo off
REM ForestStack Cypress Test Execution Script for Windows
REM This script runs Cypress tests and generates comprehensive reports

echo ==========================================
echo ForestStack Cypress Test Execution
echo ==========================================

REM Clean previous reports
echo Cleaning previous reports...
if exist cypress\reports rmdir /s /q cypress\reports
if exist cypress\screenshots rmdir /s /q cypress\screenshots
if exist cypress\videos rmdir /s /q cypress\videos

REM Create reports directory
mkdir cypress\reports

REM Run tests
echo Running Cypress tests...
call npm run test:ci
set TEST_EXIT_CODE=%ERRORLEVEL%

REM Check if tests completed
if %TEST_EXIT_CODE% EQU 0 (
    echo Tests completed successfully
) else (
    echo Some tests failed
)

REM Generate merged report
echo Generating test reports...
call npm run report:merge

REM Check if report generation succeeded
if exist "cypress\reports\mochawesome-report\mochawesome.html" (
    echo Report generated successfully!
    echo Report location: cypress\reports\mochawesome-report\mochawesome.html
    echo.
    echo Opening report in browser...
    start cypress\reports\mochawesome-report\mochawesome.html
) else (
    echo Report generation failed
    exit /b 1
)

echo ==========================================
echo Test execution complete!
echo ==========================================
pause


