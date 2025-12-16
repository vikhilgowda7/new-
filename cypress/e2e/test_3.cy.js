describe('Verify the error messages displayed at username and password field, when the invalid username and valid password in entered.', () => {
    it('passes', () => {
  
      cy.visit('https://uat.catalogue.forestdx.iudx.io/')
      cy.viewport(1920, 1080)
  
      cy.xpath("//button[normalize-space()='Login / Register']").click()
  
      const keycloakOrigin = 'https://staging.keycloak.update.iudx.io'
      const credentials = {
        username: 'vikhilgowdatest7@gmail.com',
        password: 'Cdpg@123',
        origin: keycloakOrigin,
      }
  
      cy.origin(
        keycloakOrigin,
        { args: credentials },
        ({ username, password, origin }) => {
          cy.location('origin', { timeout: 20000 }).should('eq', origin)
          // Enter username
          cy.get('#username').type(username)
          // Enter password
          cy.get('#password').type(password)
          // Click login button
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