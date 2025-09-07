/// <reference types="cypress" />

describe('My Project End-to-End Testing', () => {

  const baseUrl = '/'; // use Cypress baseUrl

  it('Visits the homepage', () => {
    cy.visit(baseUrl);
    cy.contains('Welcome to NovaBlog');
  });

  it('Checks navigation links', () => {
    cy.visit(baseUrl);
    cy.get('nav').contains('About').click();
    cy.url().should('include', '/about.html');
    cy.get('.about-section h2').should('contain.text', 'About NovaBlog');
  });

  it('Tests login UI validation (no network)', () => {
    cy.visit('/login.html');
    // Remove HTML5 required attributes so submit event fires
    cy.get('#email').invoke('removeAttr', 'required').clear();
    cy.get('#password').invoke('removeAttr', 'required').clear();
    cy.get('button[type="submit"]').click();
    cy.get('#message').should('contain.text', 'Both fields are required.');
  });

  it('Mocks contact form API and checks success flow', () => {
    // Intercept the POST to backend and stub success
    cy.intercept('POST', '**/api/contact', {
      statusCode: 200,
      body: { message: 'Message sent successfully!' }
    }).as('postContact');

    cy.visit('/contact.html');
    cy.get('#name').type('Harshitha');
    cy.get('#email').type('harshitha@example.com');
    cy.get('#message').type('This is a test message.');

    // The page uses alert() on success. Stub window:alert and assert call
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Send Message').click();
    cy.wait('@postContact');
    cy.get('@alert').should('have.been.calledWith', 'Message sent successfully!');
  });

});
