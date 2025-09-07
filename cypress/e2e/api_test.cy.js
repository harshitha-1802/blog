describe('API - Blog', () => {
  // baseUrl is set in cypress.config.js → requests can be relative

  it('GET /api/blog returns 200 and array', () => {
    cy.request('/api/blog')
      .its('status')
      .should('eq', 200);

    cy.request('/api/blog')
      .its('body')
      .should('be.an', 'array');
  });

  it('POST /api/blog creates a blog', () => {
    const newBlog = {
      title: 'Cypress Test Blog',
      category: 'Testing',
      content: 'This is created by Cypress',
      tags: 'cypress, e2e'
    };

    cy.request('POST', '/api/blog', newBlog)
      .then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('id');
      });
  });
});
