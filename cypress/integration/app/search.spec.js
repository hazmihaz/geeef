describe('Geef App', () => {
    it('successfully loads', () => {
        cy.visit('http://localhost:8080') // change URL to match your dev URL
    })

    it('focused on searchbox', () => {
        // https://on.cypress.io/focus
        cy.get('.search-input').should('be.focused')
    })

    it('type into searchbox', () => {
        cy.get('.search-input')
            .type('kitten')
            .should('have.value', 'kitten')
    })

    it('submit form', () => {
        cy.get('.search-box form').submit()

        cy.get('.search-input').should('not.be.focused')
    })

    it('shows result', () => {
        cy.get('.result-items .item').should(items => {
            expect(items.length).to.be.gt(0)
        })

        cy.get('.result-items .item')
            .find('img')
            .should('be.visible')
    })

    it('loads more', () => {
        cy.get('.btn-load')
            .scrollIntoView()
            .click()
        cy.get('.result-items .item').should(items => {
            expect(items.length).to.be.gt(20)
        })
    })

    it('shows fullscreen preview', () => {
        cy.get('.result-items .item')
            .first()
            .click()

        cy.get('.preview')
            .find('video')
            .should('be.visible')
    })

    it('copies url', () => {
        cy.get('.btn-copy').click()
        cy.wait(2000)
    })

    it('closes fullscreen preview', () => {
        cy.get('.close').click()
        cy.get('.preview').should('not.exist')
    })
})
