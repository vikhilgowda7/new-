const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // Existing settings (UNCHANGED)
  video: true,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  viewportWidth: 1285,
  viewportHeight: 677,

  // Reporter configuration (for Jenkins + HTML report generation)
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,     // HTML will be generated later using marge
    json: true       // Required for Jenkins report generation
  },

  e2e: {
    baseUrl: 'https://uat.catalogue.forestdx.iudx.io',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

    // Required for Cypress v12+ (safe, does not affect tests)
    setupNodeEvents(on, config) {
      return config
    }
  }
})
