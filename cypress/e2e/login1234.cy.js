// Helper function to parse CSV data
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter((line) => line.trim() !== '')
  if (lines.length < 2) return [] // Need at least header + one row

  const headers = lines[0].split(',').map((h) => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Skip empty lines

    const values = []
    let currentValue = ''
    let insideQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim())
        currentValue = ''
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim())

    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    // Only add row if test_case is defined (not empty)
    if (row.test_case && row.test_case.trim() !== '') {
      data.push(row)
    }
  }

  return data
}

describe('Login Functionality Test Suite - Data Driven', () => {
  // Execute all test cases from CSV file
  it('Execute all login test cases from CSV file', () => {
    // Read CSV file and parse test data
    cy.readFile('cypress/fixtures/login_test_data.csv', 'utf-8').then((csvContent) => {
      const testDataArray = parseCSV(csvContent)

      if (!testDataArray || testDataArray.length === 0) {
        cy.log('WARNING: No test cases found in login_test_data.csv')
        return
      }

      cy.log(`Loaded ${testDataArray.length} test case(s) from CSV`)

      // Initialize failed scenarios array
      cy.wrap([]).as('failedScenarios')

      // Execute test cases sequentially with proper error handling
      let chain = cy.wrap(null)

      testDataArray.forEach((testCase, index) => {
        chain = chain
          .then(
            () => {
              cy.log(`\n=== Executing Test Case ${testCase.test_case}: ${testCase.description} ===`)

              // Visit the page for each test case
              cy.visit('https://uat.catalogue.forestdx.iudx.io/')
              cy.viewport(1920, 1080)

              cy.xpath("//button[normalize-space()='Login / Register']").click()

              const keycloakOrigin = 'https://staging.keycloak.update.iudx.io'
              const credentials = {
                username: testCase.username || '',
                password: testCase.password || '',
                origin: keycloakOrigin,
                expectedResult: testCase.expected_result,
                checkUsernameError: testCase.check_username_error?.toUpperCase() === 'TRUE',
                checkPasswordError: testCase.check_password_error?.toUpperCase() === 'TRUE',
                expectedErrorText: testCase.expected_error_text || '',
              }

              return cy.origin(
                keycloakOrigin,
                { args: credentials },
                ({
                  username,
                  password,
                  origin,
                  expectedResult,
                  checkUsernameError,
                  checkPasswordError,
                  expectedErrorText,
                }) => {
                  cy.location('origin', { timeout: 20000 }).should('eq', origin)

                  // Enter username if provided
                  if (username) {
                    cy.get('#username').clear().type(username)
                  }

                  // Enter password if provided
                  if (password) {
                    cy.get('#password').clear().type(password)
                  }

                  // Click login button
                  cy.get('#kc-login').click()

                  // Handle expected result: success or error
                  if (expectedResult === 'success') {
                    // Success case - wait for redirect, will check profile icon after cy.origin
                    cy.wait(2000)
                  } else if (expectedResult === 'error') {
                    // Error case - validate error messages
                    const usernameErrorSelector = 'span#input-error'
                    const passwordErrorSelector = 'span#input-error-password'

                    // Check username error if required - using exact match only
                    if (checkUsernameError) {
                      cy.get(usernameErrorSelector, { timeout: 20000 }).then(($usernameError) => {
                        const actualMessage = $usernameError.text().trim()

                        // Exact match validation only
                        if (actualMessage === expectedErrorText) {
                          cy.log(
                            'user did not login, Invalid username or password. error is displayed'
                          )
                        } else {
                          cy.log('Invalid username or password message is not displaying')
                          cy.log(`Expected: "${expectedErrorText}"`)
                          cy.log(`Actual message displayed: "${actualMessage}"`)
                          throw new Error(
                            `Invalid username or password message is not displaying. Expected: "${expectedErrorText}", Actual: "${actualMessage}"`
                          )
                        }
                      })
                    }

                    // Check password error if required - using exact match only
                    if (checkPasswordError) {
                      cy.get(passwordErrorSelector, { timeout: 20000 }).then(($passwordError) => {
                        const actualMessage = $passwordError.text().trim()

                        // Exact match validation only
                        if (actualMessage === expectedErrorText) {
                          // Error message matches exactly
                        } else {
                          cy.log('Invalid username or password message is not displaying')
                          cy.log(`Expected: "${expectedErrorText}"`)
                          cy.log(`Actual message displayed: "${actualMessage}"`)
                          throw new Error(
                            `Invalid username or password message is not displaying under password field. Expected: "${expectedErrorText}", Actual: "${actualMessage}"`
                          )
                        }
                      })

                      cy.log(
                        'Login unsuccessful, Invalid username or password message is displayed under username and password field'
                      )
                    }
                  }
                }
              )
            },
            (error) => {
              // Catch any error in the initial setup
              const errorMessage = error.message || error.toString()
              cy.get('@failedScenarios').then((failed) => {
                failed.push({
                  testCase: testCase.test_case,
                  description: testCase.description,
                  error: errorMessage,
                  timestamp: new Date().toISOString(),
                })
                cy.wrap(failed).as('failedScenarios')
              })
              cy.log(`\n❌ Test Case ${testCase.test_case} FAILED (setup): ${errorMessage}`)
              return cy.wrap(null, { log: false })
            }
          )
          .then(
            () => {
              // After cy.origin, check for profile icon if success is expected
              if (testCase.expected_result === 'success') {
                const profileIconXpath =
                  "//div[@class='profile-icon d-flex justify-content-center align-items-center profile-icon-desk']//span[contains(text(),'VC')]"

                return cy.xpath(profileIconXpath, { timeout: 20000 }).then(($el) => {
                  if ($el.length > 0) {
                    cy.log('Login is successful')
                  } else {
                    throw new Error('Login is failed, profile icon is not available')
                  }
                })
              }
            },
            (error) => {
              // Catch errors from cy.origin or profile check
              const errorMessage = error.message || error.toString()
              cy.get('@failedScenarios').then((failed) => {
                failed.push({
                  testCase: testCase.test_case,
                  description: testCase.description,
                  error: errorMessage,
                  timestamp: new Date().toISOString(),
                })
                cy.wrap(failed).as('failedScenarios')
              })
              cy.log(`\n❌ Test Case ${testCase.test_case} FAILED: ${errorMessage}`)
              return cy.wrap(null, { log: false })
            }
          )
          .then(
            () => {
              // Test case passed
              cy.log(`✅ Test Case ${testCase.test_case} PASSED`)
            },
            (error) => {
              // Final catch - should not happen if previous handlers worked
              const errorMessage = error.message || error.toString()
              cy.get('@failedScenarios').then((failed) => {
                failed.push({
                  testCase: testCase.test_case,
                  description: testCase.description,
                  error: errorMessage,
                  timestamp: new Date().toISOString(),
                })
                cy.wrap(failed).as('failedScenarios')
              })
              cy.log(`\n❌ Test Case ${testCase.test_case} FAILED (final catch): ${errorMessage}`)
              return cy.wrap(null, { log: false })
            }
          )
      })

      // After all test cases, show summary
      chain.then(() => {
        cy.get('@failedScenarios').then((failedScenarios) => {
          if (failedScenarios.length > 0) {
            cy.log('\n' + '='.repeat(80))
            cy.log('FAILED SCENARIOS SUMMARY')
            cy.log('='.repeat(80))
            failedScenarios.forEach((failed, index) => {
              cy.log(`\n${index + 1}. Test Case ${failed.testCase}: ${failed.description}`)
              cy.log(`   Error: ${failed.error}`)
              cy.log(`   Timestamp: ${failed.timestamp}`)
            })
            cy.log('\n' + '='.repeat(80))
            cy.log(
              `Total Failed: ${failedScenarios.length} out of ${testDataArray.length} test cases`
            )
            cy.log('='.repeat(80) + '\n')

            // Write to console for easy visibility
            console.error('\n=== FAILED SCENARIOS ===')
            console.table(failedScenarios)
            console.error(
              `\nTotal: ${failedScenarios.length} out of ${testDataArray.length} test cases failed\n`
            )

            // Mark test as failed if any scenarios failed
            throw new Error(
              `${failedScenarios.length} test case(s) failed. See Cypress logs and browser console (F12) for details.`
            )
          } else {
            cy.log('\n' + '='.repeat(80))
            cy.log('✅ ALL TEST CASES PASSED SUCCESSFULLY!')
            cy.log('='.repeat(80) + '\n')
          }
        })
      })
    })
  })
})
