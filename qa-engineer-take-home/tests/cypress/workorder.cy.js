/// <reference types="cypress" />

const BASE_URL = 'http://localhost:3000';

// ========== CUSTOM COMMANDS ==========

Cypress.Commands.add('login', (role) => {
  cy.visit(BASE_URL);
  cy.get('#roleSelect').select(role);
});

Cypress.Commands.add('createWorkOrder', (description, site, priority) => {
  cy.get('[data-tab="create"]').click();
  cy.get('#shortDesc').type(description);
  cy.get('#site').select(site);
  cy.get('#priority').select(priority);
  cy.get('[data-testid="btn-create-submit"]').click();
  cy.wait(1000);
});

// ========== TESTS ==========

describe('Work Order Creation', () => {

  it('should create a work order with valid data', () => {
    cy.login('coordinator');
    cy.createWorkOrder('Test broken light', 'site-1', 'High');

    // Check toast
    cy.get('#toast').should('contain', 'created');

    // Check WO appears in list
    cy.get('#woTableBody tr').last().should('contain', 'Test broken light');
  });

  it('should show validation errors for empty form', () => {
    cy.login('coordinator');
    cy.get('[data-tab="create"]').click();
    cy.get('[data-testid="btn-create-submit"]').click();

    cy.get('#formErrors').should('contain', 'required');
  });

  it('should not allow Works User to create work orders', () => {
    cy.login('works-user');
    cy.get('[data-tab="create"]').should('not.be.visible');
  });

});

describe('Status Transitions', () => {

  it('should transition New Request to Under Consideration', () => {
    cy.login('coordinator');

    cy.get('#woTableBody tr').eq(1).find('.action-status').select('Under Consideration');

    cy.wait(500);
    cy.get('#woTableBody tr').eq(1).find('.status-badge').should('contain', 'Under Consideration');
  });

  it('should complete a work order with action taken', () => {
    cy.login('coordinator');

    // Find WIP work order
    cy.contains('tr', 'WO-2026-004815').find('.action-status').select('Completed');

    // Handle prompt
    cy.on('window:confirm', () => true);

    cy.contains('tr', 'WO-2026-004815').find('.status-badge').should('contain', 'Completed');
  });

});

describe('Filtering', () => {

  it('should filter by status', () => {
    cy.login('coordinator');
    cy.get('#filterStatus').select('Completed');

    cy.get('#woTableBody tr').should('have.length', 1);
  });

  it('should filter by priority', () => {
    cy.login('coordinator');
    cy.get('#filterPriority').select('Critical');

    cy.get('#woTableBody tr').should('have.length.greaterThan', 0);
  });

  it('should filter by search text', () => {
    cy.login('coordinator');
    cy.get('#filterSearch').type('004816');

    cy.get('#woTableBody tr').should('have.length', 1);
  });

});

describe('Role Permissions', () => {

  it('should show cancel button for manager', () => {
    cy.login('manager');
    cy.get('.action-cancel').should('exist');
  });

  it('should not show cancel button for coordinator', () => {
    cy.login('coordinator');
    cy.get('.action-cancel').should('not.exist');
  });


});

describe('Work Order Detail', () => {

  it('should open detail modal', () => {
    cy.login('coordinator');

    cy.get('.wo-link').first().click();

    cy.get('#detailOverlay').should('have.class', 'active');
    cy.get('#detailTitle').should('not.be.empty');
  });

  it('should show audit log', () => {
    cy.login('coordinator');
    cy.get('.wo-link').first().click();

    cy.get('.audit-entry').should('have.length.greaterThan', 0);
  });

  it('should close modal on X click', () => {
    cy.login('coordinator');
    cy.get('.wo-link').first().click();
    cy.get('#detailClose').click();

    cy.get('#detailOverlay').should('not.have.class', 'active');
  });

});
