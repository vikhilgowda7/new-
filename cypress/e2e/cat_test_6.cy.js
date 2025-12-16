describe('Catalog - Verify that on clicking the Models tab, the user is navigating to the models collection page.', () => {
  it('should navigate and interact with models page', () => {
    // Step 1: Set viewport (1285x677)
    cy.viewport(1285, 677)

    // Step 2: Navigate to the application URL (fixed from Cypress runner URL)
    cy.visit('https://uat.catalogue.forestdx.iudx.io/')

    // Wait for page to be fully loaded
    cy.url().should('include', 'uat.catalogue.forestdx.iudx.io')

    // Step 3: Check if "Models" tab is available and click on it
    cy.xpath('//html/body/app-root/div/app-home/app-header/header/div[1]/div[3]/div[2]/span')
      .should('be.visible')
      .then(($element) => {
        const elementText = $element.text().trim()
        if (elementText === 'Models') {
          cy.log('Models tab is available')
          cy.wrap($element).click({ force: true })
        } else {
          cy.log('Models tab is not available')
          throw new Error('Models tab is not available')
        }
      })

    // Step 3.1: Verify that Models tab is getting highlighted after clicking
    cy.wait(500) // Wait for highlighting to apply after click
    
    cy.xpath('//html/body/app-root/div/app-home/app-header/header/div[1]/div[3]/div[2]/span')
      .should('be.visible')
      .then(($element) => {
        // Check for highlighting indicators: active class, background color, or other visual indicators
        // Check for active class on element or parent elements
        const hasActiveClass = $element.hasClass('active') || 
                              $element.parent().hasClass('active') ||
                              $element.closest('div').hasClass('active') ||
                              $element.closest('span').hasClass('active')
        
        // Get computed styles using Cypress
        const backgroundColor = $element.css('background-color')
        const fontWeight = $element.css('font-weight')
        const borderBottom = $element.css('border-bottom')
        const textDecoration = $element.css('text-decoration')
        
        // Check if element has any highlighting indicators
        // Highlighted elements typically have: active class, non-transparent background, bold text, or border
        const hasBackground = backgroundColor && 
                            backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                            backgroundColor !== 'transparent' &&
                            backgroundColor !== 'rgba(255, 255, 255, 0)'
        
        const hasBoldText = fontWeight === 'bold' || 
                           fontWeight === '700' || 
                           (parseInt(fontWeight) && parseInt(fontWeight) >= 600)
        
        const hasBorder = borderBottom && 
                         borderBottom !== 'none' && 
                         borderBottom !== '0px' &&
                         borderBottom !== '0px none rgb(0, 0, 0)'
        
        const hasUnderline = textDecoration && textDecoration.includes('underline')
        
        const isHighlighted = hasActiveClass || hasBackground || hasBoldText || hasBorder || hasUnderline

        if (isHighlighted) {
          cy.log('Models tab is getting highlighted')
          // Test passes - tab is highlighted
        } else {
          cy.log('models tab is not getting higlighted')
          cy.log(`Active class found: ${hasActiveClass}`)
          cy.log(`Background color: ${backgroundColor}`)
          cy.log(`Font weight: ${fontWeight}`)
          cy.log(`Border: ${borderBottom}`)
          throw new Error('models tab is not getting higlighted')
        }
      })

    // Step 4: Verify "Models" heading is available after navigating to models page
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[1]/div/h2')
      .should('be.visible')
      .then(($heading) => {
        const headingText = $heading.text().trim()
        if (headingText === 'Models') {
          cy.log('Models heading is available and matches exactly')
          // Test passes - heading is correct
        } else {
          cy.log('Models heading is not available')
          throw new Error('Models heading is not available')
        }
      })

    // Step 5: Verify the models description text matches exactly
    const expectedDescription =
      'Explore, test, and contribute Models for real-world applications and research advancements.'
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[1]/div/p')
      .should('be.visible')
      .then(($element) => {
        // Trim the actual text to remove leading/trailing whitespace
        const actualText = $element.text().trim()
        // Verify description matches exactly
        if (actualText === expectedDescription) {
          cy.log('Models description matches exactly')
          // Test passes - description is correct
        } else {
          cy.log('Models description is not available or does not match')
          cy.log(`Expected: "${expectedDescription}"`)
          cy.log(`Actual: "${actualText}"`)
          throw new Error(
            `Models description is not available. Expected: "${expectedDescription}", Actual: "${actualText}"`
          )
        }
      })

    // Step 6: Verify "Filters" heading is available
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[2]/app-model-filters/div/div[1]/div/div[2]/h2')
      .should('be.visible')
      .then(($heading) => {
        const headingText = $heading.text().trim()
        if (headingText === 'Filters') {
          cy.log('Filters heading is available and matches exactly')
          // Test passes - heading is correct
        } else {
          cy.log('Filters headingText is not available')
          throw new Error('Filters headingText is not available')
        }
      })

    // Step 7: Verify all filter fields are available
    const expectedFilterFields = [
      'Organization',
      'Organization Type',
      'Industry',
      'File Format',
      'Access Permissions',
      'Model Type',
      'Last Updated',
    ]

    cy.xpath("//div[@class = 'gx-5 filter-section']/div")
      .should('have.length.greaterThan', 0)
      .then(($filterFields) => {
        const actualFilterFieldLabels = []
        const missingFields = []

        // Store all filter field labels from the page in a list
        // Try multiple ways to extract the label text
        $filterFields.each((index, element) => {
          const $field = Cypress.$(element)
          // Try to find label in common locations: label element, first text node, or specific classes
          let labelText =
            $field.find('label').first().text().trim() ||
            $field.find('[class*="label"]').first().text().trim() ||
            $field.find('span, div').first().text().trim() ||
            $field.text().trim().split('\n')[0] ||
            $field.text().trim()

          // Clean up the label text (remove extra whitespace, newlines)
          labelText = labelText.replace(/\s+/g, ' ').trim()

          if (labelText) {
            actualFilterFieldLabels.push(labelText)
          } else {
            // If no label found, use index
            actualFilterFieldLabels.push(`Filter Field ${index + 1}`)
          }
        })

        cy.log(`Expected filter fields: ${expectedFilterFields.join(', ')}`)
        cy.log(`Found ${actualFilterFieldLabels.length} filter field(s): ${actualFilterFieldLabels.join(', ')}`)

        // Compare expected fields with actual fields (exact match)
        expectedFilterFields.forEach((expectedField) => {
          const found = actualFilterFieldLabels.some(
            (actualField) => actualField === expectedField
          )
          if (!found) {
            missingFields.push(expectedField)
          }
        })

        // Check if all expected fields are present
        if (missingFields.length === 0) {
          cy.log('All filter fields are displayed correctly')
          // Test passes - all expected filter fields are present
        } else {
          cy.log('filter fields are not displayed')
          cy.log(`Missing or not matching fields: ${missingFields.join(', ')}`)
          cy.log(`Actual fields found: ${actualFilterFieldLabels.join(', ')}`)
          throw new Error(
            `filter fields are not displayed. Missing fields: ${missingFields.join(', ')}. Actual fields: ${actualFilterFieldLabels.join(', ')}`
          )
        }
      })

    // Step 9: Click on body section to close dropdown if open
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[2]')
      .should('be.visible')
      .click({ force: true })

    // Step 10: Verify model list items are displayed
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[2]/app-model-list/div/div/div/div')
      .should('have.length.greaterThan', 0)
      .then(($modelItems) => {
        const itemCount = $modelItems.length
        if (itemCount > 0) {
          cy.log(`Model list items are displayed. Found ${itemCount} item(s)`)
          // Test passes - model items are displayed
        } else {
          cy.log('Model list items are not displayed')
          throw new Error('Model list items are not displayed')
        }
      })

    // Step 11: Click on pagination next icon (»)
    cy.xpath("//span[normalize-space()='»']")
      .should('be.visible')
      .then(($nextIcon) => {
        if ($nextIcon.is(':visible')) {
          cy.log('Pagination next icon is available')
          cy.wrap($nextIcon).click({ force: true })
        } else {
          cy.log('Pagination next icon is not available')
          throw new Error('Pagination next icon is not available')
        }
      })

    // Verify model list items are still displayed after pagination
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[2]/app-model-list/div/div/div/div')
      .should('have.length.greaterThan', 0)
      .then(($modelItems) => {
        const itemCount = $modelItems.length
        if (itemCount > 0) {
          cy.log(`Model list items are displayed after pagination. Found ${itemCount} item(s)`)
          // Test passes - model items are displayed after pagination
        } else {
          cy.log('Model list items are not displayed after pagination')
          throw new Error('Model list items are not displayed after pagination')
        }
      })
      // Step 14: Click on home icon
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[1]/div/div/a[1]/img')
    .should('be.visible')
    .click({ force: true })

  // Verify navigation back to home page
  cy.url().should('include', 'uat.catalogue.forestdx.iudx.io')
})
})


  

