describe('Verify the error messages displayed at username field, when then username and password are blank.', () => {
    it('passes', () => {
  
      cy.visit('https://uat.catalogue.forestdx.iudx.io/')
      cy.viewport(1920, 1080)
  
      cy.xpath("//button[normalize-space()='Login / Register']").click()
  
      const keycloakOrigin = 'https://staging.keycloak.update.iudx.io'
      const credentials = {
    
        origin: keycloakOrigin,
      }
  
      cy.origin(
        keycloakOrigin,
        { args: credentials },
        ({ username, password, origin }) => {
          cy.location('origin', { timeout: 20000 }).should('eq', origin)
          
          cy.get('#kc-login').click()

          // Wait for error message and validate
          const usernameErrorSelector = 'span#input-error'
          const expectedErrorText = 'Invalid username or password.'

          cy.get(usernameErrorSelector, { timeout: 20000 }).then(($usernameError) => {
            const actualMessage = $usernameError.text().trim()
            
            // Check if expected and actual error text are exactly equal
            if (actualMessage === expectedErrorText) {
              // Error message is correctly displayed and exactly matches
              cy.log('user did not login, Invalid username or password. error is displayed')
            } else {
              // Error message does not match exactly - test case must fail
              cy.log('Invalid username or password message is not displaying')
              cy.log(`Expected: "${expectedErrorText}"`)
              cy.log(`Actual message displayed: "${actualMessage}"`)
              throw new Error(`Invalid username or password message is not displaying. Expected: "${expectedErrorText}", Actual: "${actualMessage}"`)
            }
          })
        }
      )
    })
  })
  