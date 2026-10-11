describe("Registrace a Ověření", () => {
    it("načte přihlašovací stránku", () => {
        cy.visit("/prihlaseni");
        cy.url().should("include", "/prihlaseni");
    });
});