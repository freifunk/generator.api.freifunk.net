/// <reference types="cypress" />

context('Form', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should change input values', () => {
    const nameText = 'John Deer';
    const urlText = 'https://www.google.com';
    const cityText = 'Berlin';
    const emailText = 'john.deer@gmail.com';
    const dateText = '2025-03-15 00:00';
    cy.get('[id="#/properties/name-input"]').clear().type(nameText);
    cy.get('[id="#/properties/url-input"]').clear().type(urlText);
    cy.get('[id="#/properties/location/properties/city-input"]').clear().type(cityText);
    cy.get('[id="#/properties/contact/properties/email-input"]').clear().type(emailText);
    cy.get('[id="#/properties/lastchange-input"]').clear().type(dateText);
    cy.get('[id="#/properties/url3-input"]').clear().type(urlText);

    cy.get('.leaflet-marker-icon').trigger('mousedown', { which: 1 })
    .trigger('mousemove', 2, 2)
    .trigger('mouseup', { force: true })

    cy.get('[id="#/properties/location/properties/city-input"]').clear().type(cityText);

    cy.get('[id="boundData"]').invoke('text').then((content => {
      const data = JSON.parse(content);

      expect(data.name).to.equal(nameText);
      expect(data.url).to.equal(urlText);
    }));
    cy.get('[id="errors"]').should('be.empty');
  });

  it('should show errors', () => {
    const nameText = 'John Deer';
    const urlText = 'https://www.google.com';
    cy.get('[id="#/properties/name-input"]').clear().type(nameText);
    cy.get('[id="#/properties/url-input"]').clear().type(urlText);
    cy.get('[id="#/properties/location/properties/city-input"]').clear().type(nameText);

    cy.get('[id="boundData"]').invoke('text').then((content => {
      const data = JSON.parse(content);

      expect(data.name).to.equal(nameText);
      expect(data.url).to.equal(urlText);
    }));
    cy.get('[id="errors"]').should('have.length', 1);
    cy.get('[id="errors"]').should('contain', 'geoCode');
  });

  it('should set map coordinates', () => {
    cy.get('.leaflet-marker-icon').trigger('mousedown', { which: 1 })
    .trigger('mousemove', 2, 2)
    .trigger('mouseup', { force: true })
    cy.wait(1000)
    // Verify in the form data
    cy.get('[id="boundData"]').invoke('text').then((content => {
      const data = JSON.parse(content);

      expect(data.location.geoCode.lat).to.be.closeTo(51.52, 1);
      expect(data.location.geoCode.lon).to.be.closeTo(10.40, 1);
    }));
  });
})
