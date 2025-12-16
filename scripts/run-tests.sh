#!/bin/bash

# ForestStack Cypress Test Execution Script
# This script runs Cypress tests and generates comprehensive reports

echo "=========================================="
echo "ForestStack Cypress Test Execution"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Clean previous reports
echo -e "${YELLOW}Cleaning previous reports...${NC}"
rm -rf cypress/reports
rm -rf cypress/screenshots
rm -rf cypress/videos

# Create reports directory
mkdir -p cypress/reports

# Run tests
echo -e "${YELLOW}Running Cypress tests...${NC}"
npm run test:ci

# Check if tests completed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Tests completed successfully${NC}"
else
    echo -e "${RED}Some tests failed${NC}"
fi

# Generate merged report
echo -e "${YELLOW}Generating test reports...${NC}"
npm run report:merge

# Check if report generation succeeded
if [ -f "cypress/reports/mochawesome-report/mochawesome.html" ]; then
    echo -e "${GREEN}Report generated successfully!${NC}"
    echo -e "${GREEN}Report location: cypress/reports/mochawesome-report/mochawesome.html${NC}"
    
    # Open report in default browser (uncomment if desired)
    # npm run report:open
else
    echo -e "${RED}Report generation failed${NC}"
    exit 1
fi

echo "=========================================="
echo "Test execution complete!"
echo "=========================================="


