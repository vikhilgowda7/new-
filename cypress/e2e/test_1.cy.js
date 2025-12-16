describe('Verify the login successful by entering the valid username and password.', () => {
  it('passes', () => {

    cy.visit('https://uat.catalogue.forestdx.iudx.io/')
    cy.viewport(1920, 1080)

    cy.xpath("//button[normalize-space()='Login / Register']").click()

    const keycloakOrigin = 'https://staging.keycloak.update.iudx.io'
    const credentials = {
      username: 'vikhilgowda7@gmail.com',
      password: 'Cdpg@123',
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
      }
    )

    // After login, check for profile icon
    const profileIconXpath = "//div[@class='profile-icon d-flex justify-content-center align-items-center profile-icon-desk']//span[contains(text(),'VC')]"

    cy.xpath(profileIconXpath, { timeout: 20000 }).then(($el) => {
      if ($el.length > 0) {
        cy.log('Login is successful')
      } else {
        throw new Error('Login is failed, profile icon is not available')
      }
    })

  })
})
