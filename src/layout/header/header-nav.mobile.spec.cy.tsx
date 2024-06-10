'use client'
import HeaderNavMobile from "./header-nav-mobile";
describe('headerNavMobile',()=>{
    it('invisible and move 100% to the right when unActive',()=>{
        cy.mount(<HeaderNavMobile />)
        cy.get('[data-cy="nav-mobile"]').as('nav-mobile')
        cy.get('@nav-mobile').should('have.class','translate-x-full duration-500')
        cy.get('@nav-mobile').should('not.be.visible')
    
        cy.get('[data-cy="nav-mobile-open-btn"]').as('btn-open').click()
    
        cy.get('@nav-mobile').should('not.have.class','translate-x-full')
        cy.get('@nav-mobile').should('have.class','translate-x-0')
    
        cy.get('@btn-open').should('be.disabled')
    
    
        cy.get("[data-cy='nav-mobile-close-btn']").as('btn-close')
        cy.get('@btn-close').should('not.be.disabled')
        cy.get('@btn-close').click({force:true})
    
        cy.get('@nav-mobile').should('have.class','translate-x-full')
        cy.get('@btn-close').should('not.be.visible')
        
    })
   
})