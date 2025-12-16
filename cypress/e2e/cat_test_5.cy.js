describe('Catalog - Verify that the on clicking the Dataset tab, the user is navigating the dataset collection page.', () => {
  it('should navigate and interact with catalogue page', () => {
    // Step 1: Set viewport (1285x677)
    cy.viewport(1285, 677)

    // Step 2: Navigate to the application URL (fixed from Cypress runner URL)
    cy.visit('https://uat.catalogue.forestdx.iudx.io/')

    // Wait for page to be fully loaded
    cy.url().should('include', 'uat.catalogue.forestdx.iudx.io')

    // Step 3: Check if "Datasets" tab is available and click on it
    cy.xpath('//html/body/app-root/div/app-home/app-header/header/div[1]/div[3]/div[1]/span')
      .should('be.visible')
      .then(($element) => {
        const elementText = $element.text().trim()
        if (elementText === 'Datasets') {
          cy.log('Datasets tab is available')
          cy.wrap($element).click({ force: true })
        } else {
          cy.log('Datasets tab is not available')
          throw new Error('Datasets tab is not available')
        }
      })

    // Step 3.1: Verify that Datasets tab is getting highlighted after clicking
    cy.wait(500) // Wait for highlighting to apply after click

    cy.xpath('//html/body/app-root/div/app-home/app-header/header/div[1]/div[3]/div[1]/span')
      .should('be.visible')
      .then(($element) => {
        // Check for highlighting indicators: active class, background color, or other visual indicators
        // Check for active class on element or parent elements
        const hasActiveClass =
          $element.hasClass('active') ||
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
        const hasBackground =
          backgroundColor &&
          backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          backgroundColor !== 'transparent' &&
          backgroundColor !== 'rgba(255, 255, 255, 0)'

        const hasBoldText =
          fontWeight === 'bold' ||
          fontWeight === '700' ||
          (parseInt(fontWeight) && parseInt(fontWeight) >= 600)

        const hasBorder =
          borderBottom &&
          borderBottom !== 'none' &&
          borderBottom !== '0px' &&
          borderBottom !== '0px none rgb(0, 0, 0)'

        const hasUnderline = textDecoration && textDecoration.includes('underline')

        const isHighlighted =
          hasActiveClass || hasBackground || hasBoldText || hasBorder || hasUnderline

        if (isHighlighted) {
          cy.log('Datasets tab is getting highlighted')
          // Test passes - tab is highlighted
        } else {
          cy.log('datasets tab is not getting higlighted')
          cy.log(`Active class found: ${hasActiveClass}`)
          cy.log(`Background color: ${backgroundColor}`)
          cy.log(`Font weight: ${fontWeight}`)
          cy.log(`Border: ${borderBottom}`)
          throw new Error('datasets tab is not getting higlighted')
        }
      })

    // Step 4: Verify "Datasets" heading is available after navigating to datasets page
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[1]/div/h2[contains(text(),"Datasets")]')
      .should('be.visible')
      .then(($heading) => {
        const headingText = $heading.text().trim()
        if (headingText === 'Datasets') {
          cy.log('Datasets heading is available and matches exactly')
          // Test passes - heading is correct
        } else {
          cy.log('Datasets heading is not available')
          throw new Error('Datasets heading is not available')
        }
      })

    // Step 5-7: Verify the dataset description text is exactly equal to expected text
    const expectedDescription =
      ' Discover a rich repository of forest-related data enabling holistic insights, policy development, and tech-driven solutions for sustainable forest management and biodiversity preservation. '
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[1]/div/p')
      .should('be.visible')
      .then(($element) => {
        const actualText = $element.text()
        if (actualText === expectedDescription) {
          cy.log('Dataset description matches exactly')
          // Test passes - description is correct
        } else {
          cy.log('the dataset discription is wrong')
          cy.log(`Expected: "${expectedDescription}"`)
          cy.log(`Actual: "${actualText}"`)
          throw new Error(
            `the dataset discription is wrong. Expected: "${expectedDescription}", Actual: "${actualText}"`
          )
        }
      })

    // Step 8: Verify "Filters" heading is available
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[2]/app-datasets-filters/div/div[1]/div/div[2]/h2[contains(text(),"Filters")]')
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

    // Step 8.1: Verify all filter fields are available
    const expectedFilterFields = [
      'Concepts',
      'Tags',
      'File Format',
      'Access Permissions',
      'Resource Server Name',
      'Last Updated',
    ]

    cy.xpath("//div[@class = 'filter-section gx-5']/div")
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


    // Step 11-12: Verify 8 dataset cards are displayed
    cy.xpath("//div[@class = 'dataset-cards-container-vertical row g-5']/app-dataset-card-new")
      .should('have.length', 8)
      .then(($datasetCards) => {
        const datasetLabels = []
        const missingDatasets = []

        // Extract labels and store in a list
        $datasetCards.each((index, element) => {
          const $card = Cypress.$(element)
          // Try to find the label/text within the dataset card
          // Common selectors for dataset card labels
          const labelText =
            $card.find('h3, h4, .card-title, .dataset-title, [class*="title"]').first().text().trim() ||
            $card.text().trim().split('\n')[0] ||
            `Dataset ${index + 1}`

          if (labelText && $card.is(':visible')) {
            datasetLabels.push(labelText)
          } else {
            missingDatasets.push(`Dataset card at index ${index + 1}`)
          }
        })

        cy.log(`Found ${datasetLabels.length} dataset card(s): ${datasetLabels.join(', ')}`)

        // Verify exactly 8 dataset cards are displayed
        if (datasetLabels.length === 8 && missingDatasets.length === 0) {
          cy.log('All 8 dataset cards are displayed correctly')
          // Test passes - all 8 dataset cards are present
        } else {
          cy.log('data set is not available')
          if (missingDatasets.length > 0) {
            cy.log(`Missing dataset cards: ${missingDatasets.join(', ')}`)
          }
          if (datasetLabels.length !== 8) {
            cy.log(`Expected 8 dataset cards, but found ${datasetLabels.length}`)
          }
          throw new Error(
            `data set is not available. Expected 8 dataset cards, found ${datasetLabels.length}. Missing: ${missingDatasets.join(', ')}`
          )
        }
      })

    // Step 13: Click on pagination next icon (»)
    cy.xpath("//span[normalize-space()='»']")
      .should('be.visible')
      .click({ force: true })

    // Wait for pagination to load and verify dataset cards are displayed
    cy.xpath("//div[@class = 'dataset-cards-container-vertical row g-5']/app-dataset-card-new")
      .should('have.length.greaterThan', 0)
      .then(($datasetCards) => {
        const cardCount = $datasetCards.length
        if (cardCount > 0) {
          cy.log(`Dataset cards are displayed. Found ${cardCount} dataset card(s)`)
          // Test passes - dataset cards are displayed
        } else {
          cy.log('Dataset cards are not displayed')
          throw new Error('Dataset cards are not displayed after clicking pagination next icon')
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

