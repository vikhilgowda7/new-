describe('Catalog - Verify that on clicking the Use Cases tab, the user is navigating to the use cases collection page.', () => {
  it('should navigate and interact with use cases page', () => {
    // Step 1: Set viewport (1285x677)
    cy.viewport(1285, 677)

    // Step 2: Navigate to the application URL (fixed from Cypress runner URL)
    cy.visit('https://uat.catalogue.forestdx.iudx.io/')

    // Wait for page to be fully loaded
    cy.url().should('include', 'uat.catalogue.forestdx.iudx.io')

    // Step 3: Check if "Use Cases" tab is available and click on it
    cy.xpath('//html/body/app-root/div/app-home/app-header/header/div[1]/div[3]/div[3]/span')
      .should('be.visible')
      .then(($element) => {
        const elementText = $element.text().trim()
        if (elementText === 'Use Cases' || elementText.includes('Use Cases')) {
          cy.log('Use Cases tab is available')
          cy.wrap($element).click({ force: true })
        } else {
          cy.log('Use Cases tab is not available')
          throw new Error('Use Cases tab is not available')
        }
      })

    // Step 4: Verify "Use Cases" heading is available after navigating to use cases page
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[1]/div/h2')
      .should('be.visible')
      .then(($heading) => {
        const headingText = $heading.text().trim()
        if (headingText === 'Use Cases' || headingText.includes('Use Cases')) {
          cy.log('Use Cases heading is available')
          // Click on the heading as per the JSON step
          cy.wrap($heading).click({ force: true })
        } else {
          cy.log('Use Cases heading is not available')
          throw new Error('Use Cases heading is not available')
        }
      })

    // Step 5: Click on the description paragraph
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[1]/div/p')
      .should('be.visible')
      .then(($element) => {
        const elementText = $element.text().trim()
        if (elementText.includes('usecase') || elementText.includes('Access')) {
          cy.log('Use Cases description is available')
          cy.wrap($element).click({ force: true })
        } else {
          cy.log('Use Cases description is not available')
          throw new Error('Use Cases description is not available')
        }
      })

    // Step 6: Verify "Filters" heading is available and click on it
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[2]/app-usecase-filters/div/div[1]/div/div[2]/h2')
      .should('be.visible')
      .then(($heading) => {
        const headingText = $heading.text().trim()
        if (headingText === 'Filters') {
          cy.log('Filters heading is available and matches exactly')
          cy.wrap($heading).click({ force: true })
        } else {
          cy.log('Filters heading is not available')
          throw new Error('Filters heading is not available')
        }
      })

    // Step 7: Click on use case list item
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[2]/app-usecase-list/div/div/div/div')
      .should('be.visible')
      .should('have.length.greaterThan', 0)
      .first()
      .click({ force: true })

    // Step 8: Click on home icon
    cy.xpath('//html/body/app-root/div/app-home/app-home/div/div[1]/div/div/a[1]/img')
      .should('be.visible')
      .click({ force: true })

    // Verify navigation back to home page
    cy.url().should('include', 'uat.catalogue.forestdx.iudx.io')
  })
})

