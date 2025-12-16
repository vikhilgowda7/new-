describe('Verify the error messages displayed at username and password field, when the valid username and invalid password in entered.', () => {
    it('passes', () => {
  
      cy.visit('https://uat.catalogue.forestdx.iudx.io/')
      cy.viewport(1920, 1080)
  
      cy.xpath("//button[normalize-space()='Login / Register']").click()
  
      const keycloakOrigin = 'https://staging.keycloak.update.iudx.io'
      const credentials = {
        username: 'vikhilgowda7@gmail.com',
        password: 'Cdpg@125',
        origin: keycloakOrigin,
      }
  
      cy.origin(
        keycloakOrigin,
        { args: credentials },
        ({ username, password, origin }) => {
          cy.location('origin', { timeout: 20000 }).should('eq', origin)
          cy.get('#username').type(username)
          cy.get('#password').type(password)
          cy.get('#kc-login').click()

          const usernameErrorSelector = 'span#input-error'
          const passwordErrorSelector = 'span#input-error-password'
          const expectedErrorText = 'Invalid username or password'

          cy.get(usernameErrorSelector, { timeout: 20000 }).then(($usernameError) => {
            const message = $usernameError.text().trim()
            if (!message.includes(expectedErrorText)) {
              throw new Error('Invalid username or password message is not displayed under username field')
            }
          })

          cy.get(passwordErrorSelector, { timeout: 20000 }).then(($passwordError) => {
            const message = $passwordError.text().trim()
            if (!message.includes(expectedErrorText)) {
              throw new Error('Invalid username or password message is not displayed under password field')
            }
          })

          cy.log('Login unsuccessful, Invalid username or password message is displayed under username and password field')
        }
      )
    })
  })