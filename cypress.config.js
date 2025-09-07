const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5000',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    supportFile: 'cypress/support/e2e.js'
  },
});
