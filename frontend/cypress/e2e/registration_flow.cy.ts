describe("Registration & Email Verification via Log", () => {
    const testEmail = `test.${Date.now()}@example.com`;

    it("zaregistruje se, vytáhne odkaz z logu a ověří e-mail", () => {
        // 1. Registrace
        cy.visit("/registrace");
        cy.get("#firstName").type("Jana");
        cy.get("#lastName").type("Nováková");
        cy.get("#email").type(testEmail);
        cy.get("#password").type("Password123!");
        cy.get("#passwordCheck").type("Password123!");
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/overeni-emailu");

        // 2. Čtení logu
        cy.readFile("../backend/storage/logs/laravel.log").then((logContent) => {
            // Regulární výraz, který nepustí mezeru, uvozovky ", apostrof ' ani zobáčky < >
            const regExp = new RegExp(`https?://[^\\s"<'>]+/email/verify/[^\\s"<'>]+`, "g");
            const matches = logContent.match(regExp);

            expect(matches, "Verifikační odkaz nebyl v logu nalezen").to.not.be.null;

            let verificationUrl = matches[matches.length - 1];

            // 1. Nahrazení HTML entit &amp; za &
            // 2. Odstranění případných zbylých HTML znaků na konci URL
            verificationUrl = verificationUrl
                .replace(/&amp;/g, "&")
                .replace(/[>"'\s]+$/, "");

            cy.log("Vyčištěná URL pro request:", verificationUrl);

            // 3. Odeslání požadavku
            cy.request({
                method: "GET",
                url: verificationUrl,
                followRedirect: false,
                failOnStatusCode: false
            }).then((response) => {
                cy.log("Status odpovědi:", response.status);
                cy.log("Location přesměrování:", response.headers.location);

                expect(response.status).to.eq(302);
                expect(response.headers.location).to.not.include("verify=false");

                // Po úspěšném ověření v DB pokračujeme v aplikaci
                cy.visit("/overeni-emailu?verify=true");
            });
        });
        cy.url().should("include", "/zvoleni-profilu")
    });
});