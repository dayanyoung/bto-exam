import { faker } from '@faker-js/faker';

describe('Registration Functionalities Tests', () => {

  describe('Navigates To BTO wesbite', () => { 
    before(() => {
      cy.visit('https://b2c.btoprod.com/')
    })

    it('should display a login form', () => {
      cy.get('[id="loginForm"]').should('be.visible')
    })
  })

  describe('Validate Register Button', () => { 
    beforeEach(() => {
      cy.visit('https://b2c.btoprod.com/')
    })
    it('register button is visble', () => {
      cy.get('button').contains('Create account for free!').should('be.visible')
    })
    it('redirects to registration page', () => {
      cy.get('button').contains('Create account for free!').click()
      cy.url().should('be.equal', 'https://account.btoprod.com/register-c/get-started')
    })
  })

  describe('Validate Email Address', () => { 
    beforeEach(() => {
      cy.visit('https://b2c.btoprod.com/')
      cy.get('button').contains('Create account for free!').click()
    })

    describe('Valid email address input shall not return a validation error message', () => {
      // Valid Scenario
      it('should have a domain in email address input', () => {
        cy.get('[id="input__email"]').should('be.visible')
        cy.get('[id="input__email"]').first().type(faker.internet.email())
        cy.get('button[id="btn__submit"]').first().should('be.visible').click()
        expect(Cypress.$('mat-error[id="mat-error-0"]')).not.to.exist;
        cy.url().should('be.equal', 'https://account.btoprod.com/register-c/password')
      })

    })

    describe('Invalid email address input shall return a validation error message', () => {

      it('should have empty field', () => {
        cy.get('[id="input__email"]').should('be.visible').clear()
        cy.get('button[id="btn__submit"]').first().should('be.visible').click()
        cy.get('mat-error[id="mat-error-0"]').contains('Email address is required').should('be.visible')
        cy.url().should('be.equal', 'https://account.btoprod.com/register-c/get-started')
      })

      it('should have no domain in email', () => {
        cy.get('[id="input__email"]').should('be.visible')
        cy.get('[id="input__email"]').first().type('yana_smith')
        cy.get('button[id="btn__submit"]').first().should('be.visible').click()
        // enters password page
        cy.get('[id="input__password"]').type('1wordP@s$')
        cy.get('button[id="btn__submit"]').should('not.be.disabled').click()
        // enter name page
        cy.get('input[data-placeholder="First Name"]').click().type("Megan")
        cy.get('input[data-placeholder="Last Name"]').click().type("Salonga")
        cy.get('button[id="btn__submit"]').should('not.be.disabled')
        cy.get('button[id="btn__back"]').should('not.be.disabled')
        cy.get('button[id="btn__submit"]').click()
        cy.get('[id="toast-container"]').should('be.visible')
        cy.get('[id="toast-container"]').contains(' "Email" must be a valid email ')
      })

      it('should have inputted an existing/duplicate email', () => {
        cy.get('[id="input__email"]').should('be.visible')
        cy.get('[id="input__email"]').first().type('test@mail.com')
        cy.get('button[id="btn__submit"]').first().should('be.visible').click()
        // enters password page
        cy.get('[id="input__password"]').type('1wordP@s$')
        cy.get('button[id="btn__submit"]').should('not.be.disabled').click()
        // enter name page
        cy.get('input[data-placeholder="First Name"]').click().type("Megan")
        cy.get('input[data-placeholder="Last Name"]').click().type("Salonga")
        cy.get('button[id="btn__submit"]').should('not.be.disabled')
        cy.get('button[id="btn__back"]').should('not.be.disabled')
        cy.get('button[id="btn__submit"]').click()
        cy.get('[id="toast-container"]').should('be.visible')
        cy.get('[id="toast-container"]').contains(' An account with this email address already exists ')
      })

    })

  }) 

  describe('Validate Password Page', () => { //OK
    beforeEach(() => {
      cy.visit('https://b2c.btoprod.com/')
      cy.get('button').contains('Create account for free!').click()
      cy.get('[id="input__email"]').first().type(faker.internet.email())
      cy.get('button[id="btn__submit"]').first().should('be.visible').click()
    })

    describe('Validate password page UI', () => {
      it('password field is visible', () => {
        cy.get('[id="input__password"]').should('be.visible')
      })
      it('password field is empty by default', () => {
        cy.get('[id="input__password"]').should('be.empty')
      })
      it('password hints are displayed', () => {
        cy.get('span').contains('span', '8 Characters')
        cy.get('span').contains('span', 'Numeric')
        cy.get('span').contains('span', 'Lowercase')
        cy.get('span').contains('span', 'Special')
        cy.get('span').contains('span', 'Uppercase')
      })
      it('password hide icon is set to visibility off by default', () => {
        cy.get('button[aria-label="Hide password"]').contains('visibility_off')
      })
    })

    describe('Valid input in password should not return a validation error message', () => {

      it('should have inputted a value that checks all the criteria of password', () => {
        cy.get('[id="input__password"]').type('1wordP@s$')
        cy.get('button[id="btn__submit"]').should('not.be.disabled')
      })
    })

    describe('Invalid input in password should not return a validation error message', () => {

      it('should have empty password field', () => {
        cy.get('[id="input__password"]').clear()
        cy.get('button[id="btn__submit"]').click()
        cy.get('mat-error').contains("Password is required.").should('be.visible')
        cy.get('button[id="btn__submit"]').should('have.attr', 'disabled')
        cy.get('button[id="btn__back"]').should('not.be.disabled')
      })

      it('should have inputted only some of the password criteria', () => {
        // invalid combination 1
        cy.get('[id="input__password"]').type('password')
        cy.get('span[id="Pass_EightChars"]').should('have.attr', 'class', 'hint__item ng-star-inserted valid')
        cy.get('span[id="Pass_Lowercase"]').should('have.attr', 'class', 'hint__item valid ng-star-inserted')
        cy.get('button[id="btn__submit"]').should('have.attr', 'disabled')
        cy.get('button[id="btn__back"]').should('not.be.disabled')
        // invalid combination 2
        cy.get('[id="input__password"]').clear().type('@123P')
        cy.get('span[id="Pass_Numeric"]').should('have.attr', 'class', 'hint__item ng-star-inserted valid')
        cy.get('span[id="Pass_Special"]').should('have.attr', 'class', 'hint__item ng-star-inserted valid')
        cy.get('span[id="Pass_Uppercase"]').should('have.attr', 'class', 'hint__item ng-star-inserted valid')
        cy.get('button[id="btn__submit"]').should('have.attr', 'disabled')
        cy.get('button[id="btn__back"]').should('not.be.disabled')
      })

    })

  })

  describe('Validate Name Page', () => { 
    beforeEach(() => {
      cy.visit('https://b2c.btoprod.com/')
      cy.get('button').contains('Create account for free!').click()
      cy.get('[id="input__email"]').first().type(faker.internet.email())
      cy.get('button[id="btn__submit"]').first().should('be.visible').click()
      cy.get('[id="input__password"]').type('1wordP@s$')
      cy.get('button[id="btn__submit"]').should('not.be.disabled')
      cy.get('button[id="btn__back"]').should('not.be.disabled')
      cy.get('button[id="btn__submit"]').click()
    })

    describe('Validate First Name', () => { 

      describe('Valid firt name input shall not return a validation error message', () => {
        it('should have contains alpha and white space', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("Joie Ashley")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__back"]').should('not.be.disabled')

          cy.get('span[class="error__message ng-star-inserted"]').should('not.exist')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
        it('shoudl have contains alpha only', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("Marianne")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__back"]').should('not.be.disabled')

          cy.get('span[class="error__message ng-star-inserted"]').should('not.exist')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
      })

      describe('Invalid first name input shall not return a validation error message', () => {
        it('should have numer inputs', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("0012")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__back"]').should('not.be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').should('exist')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid First Name')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
        it('should have alpha numeric inputs', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("Yohan 010")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__back"]').should('not.be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').should('exist')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid First Name')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
        it('should have special characters and numer inputs', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("@011@")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__back"]').should('not.be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').should('exist')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid First Name')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
      })

    })

    describe('Validate Last Name', () => { 

      describe('Valid last name inputs shall not return a validation error message', () => {
        it('should have alpha and white space', () => {   
          cy.get('input[data-placeholder="Last Name"]').click().type("Y Salonga")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__back"]').should('not.be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').should('not.exist')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
        it('should have alpha characters', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("Salonga")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__back"]').should('not.be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').should('not.exist')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
      })

      describe('Invalid last name inputs shall not return a validation error message', () => {
        it('should have numer inputs', () => {   
            cy.get('input[data-placeholder="Last Name"]').click().type("0012")
            cy.get('button[id="btn__submit"]').click({ force: true })
            cy.get('button[id="btn__back"]').should('not.be.disabled')
            cy.get('span[class="error__message ng-star-inserted"]').should('exist')
            cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid Last Name')
            cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
        it('should have alpha numeric inputs', () => {   
            cy.get('input[data-placeholder="Last Name"]').click().type("012 Smith")
            cy.get('button[id="btn__submit"]').click({ force: true })
            cy.get('button[id="btn__back"]').should('not.be.disabled')
            cy.get('span[class="error__message ng-star-inserted"]').should('exist')
            cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid Last Name')
            cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
        it('should have special character and numeric inputs', () => {   
            cy.get('input[data-placeholder="Last Name"]').click().type("@011@")
            cy.get('button[id="btn__submit"]').click({ force: true })
            cy.get('button[id="btn__back"]').should('not.be.disabled')
            cy.get('span[class="error__message ng-star-inserted"]').should('exist')
            cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid Last Name')
            cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })
      })

    })

    describe('Validate First and Last Name', () => { 
      
      describe('Valid first and last name input shall not return a validation error message', () => {
      
        it('should have alpha and white space', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("Megan Aila")
          cy.get('input[data-placeholder="Last Name"]').click().type("Y Salonga")
          cy.get('button[id="btn__submit"]').should('not.be.disabled')
          cy.get('button[id="btn__back"]').should('not.be.disabled')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")

          cy.get('mat-error[id="mat-error-1"]').should('not.exist')
          cy.get('mat-error[id="mat-error-2"]').should('not.exist')
          cy.get('mat-error[id="mat-error-4"]').should('not.exist')
          cy.get('span[class="error__message ng-star-inserted"]').should('not.exist')

          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.url().should('be.equal', 'https://account.btoprod.com/register-c/mobile-verification-b')
        })
        
        it('should have alpha characters', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("Megan")
          cy.get('input[data-placeholder="Last Name"]').click().type("Alonzo")
          cy.get('button[id="btn__submit"]').should('not.be.disabled')
          cy.get('button[id="btn__back"]').should('not.be.disabled')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
  
          cy.get('mat-error[id="mat-error-1"]').should('not.exist')
          cy.get('mat-error[id="mat-error-2"]').should('not.exist')
          cy.get('mat-error[id="mat-error-4"]').should('not.exist')
          cy.get('span[class="error__message ng-star-inserted"]').should('not.exist')
  
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.url().should('be.equal', 'https://account.btoprod.com/register-c/mobile-verification-b')
        })

      })

      describe('Invalid first and last names shall return a validation error message', () => {

        it('should have alpha and numeric inputs in either of the two fields', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("Maine")
          cy.get('input[data-placeholder="Last Name"]').click().type("1309")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('button[id="btn__back"]').should('not.be.disabled')
  
          cy.get('mat-error[id="mat-error-1"]').should('not.exist')
          cy.get('span[class="error__message ng-star-inserted"]').not('Please enter a valid First Name')
  
          cy.get('mat-error[id="mat-error-2"]').should('exist')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid Last Name')
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
  
        })

        it('should have combination of alpha numeric inputs for both fields', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("Ma1ne")
          cy.get('input[data-placeholder="Last Name"]').click().type("Sm1th")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('button[id="btn__back"]').should('not.be.disabled')
  
          cy.get('mat-error[id="mat-error-2"]').should('exist')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid First Name')
  
          cy.get('mat-error[id="mat-error-4"]').should('exist')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid Last Name')
  
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })

        it('should have combination of special character & numeric input', () => {   
          cy.get('input[data-placeholder="First Name"]').click().type("*%901")
          cy.get('input[data-placeholder="Last Name"]').click().type("@011@")
          cy.get('button[id="btn__submit"]').click({ force: true })
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('button[id="btn__back"]').should('not.be.disabled')
  
          cy.get('mat-error[id="mat-error-1"]').should('exist')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid First Name')
  
          cy.get('mat-error[id="mat-error-2"]').should('exist')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid Last Name')
  
          cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")
        })

      })

    })
  
  })

  describe('Validate Mobile Page', () => {
      beforeEach(() => {
        cy.visit('https://b2c.btoprod.com/')
        cy.get('button').contains('Create account for free!').click()
        cy.get('[id="input__email"]').first().clear().type(faker.internet.email())
        cy.get('button[id="btn__submit"]').first().should('be.visible').click()
        cy.get('[id="input__password"]').clear().type('1wordP@s$')
        cy.get('button[id="btn__submit"]').should('not.be.disabled')
        cy.get('button[id="btn__back"]').should('not.be.disabled')
        cy.get('button[id="btn__submit"]').click()

        cy.get('input[data-placeholder="First Name"]').click().clear().type("Noah")
        cy.get('input[data-placeholder="Last Name"]').click().clear().type("Cruz")
        cy.get('button[id="btn__submit"]').should('not.be.disabled')
        cy.get('button[id="btn__back"]').should('not.be.disabled')
        cy.get('input[type="checkbox"]').should('have.attr', 'aria-checked', "true")

        cy.get('button[id="btn__submit"]').click({ force: true })
        cy.url().should('be.equal', 'https://account.btoprod.com/register-c/mobile-verification-b')
      })

      describe('Valid mobile inputs shall not return a validation error message ', () => {   
        it('should have inputted exact allowed number of digits', () => {   
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()
          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278912351')

          cy.get('button[id="btn__submit"]').click()
          // OTP will now be displayed - enters valid pin
          cy.get('input[id="input__verification"]',{ timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('219320')
          cy.get('button[id="btn__submit"]').should('not.be.disabled').click()
          cy.url().should('be.equal', 'https://account.btoprod.com/confirm', {timeout: 15000})
        })
      })

      describe('Invalid mobile inputs shall return a validation error message', () => {

        it('should have less than the minimum number of input', () => {   
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('92789211')

          cy.get('button[id="btn__submit"]').should('be.disabled').click({ force: true })
          // this shall show validation error message
          cy.get('mat-error[id="mat-error-3"]').contains('Please enter a valid Mobile number')
        })

        it('should have more than the minimum number of input', () => {   
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('929211')

          cy.get('button[id="btn__submit"]').should('be.disabled').click({ force: true })
          // this shall show validation error message
          cy.get('mat-error[id="mat-error-5"]').contains('Please enter a valid Mobile number')
        })

        it('should have alpha inputs', () => {   
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('APQWS')

          cy.get('button[id="btn__submit"]').should('be.disabled').click({ force: true })
          // this shall show validation error message
          cy.get('mat-error[id="mat-error-5"]').contains('Please enter a valid Mobile number')
        })

        it('should have special characters inputs', () => {    
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('@*()^?%#!$&(-+)')

          cy.get('button[id="btn__submit"]').should('be.disabled').click({ force: true })
          // this shall show validation error
          cy.get('mat-error[id="mat-error-5"]').contains('Please enter a valid Mobile number')
        })

      })

      describe('Invalid OTP input shall return a validation error message', () => {   
        it('should have inputted less than 6 digits', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')
          cy.get('button[id="btn__submit"]').click()
                
          cy.get('input[id="input__verification"]',{ timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('2320')
          cy.get('button[id="btn__submit"]').should('be.disabled')
           
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted more than 6 digits', () => { 
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')
          cy.get('button[id="btn__submit"]').click()
           
          cy.get('input[id="input__verification"]', { timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('23091220')
          cy.get('button[id="btn__submit"]').should('be.disabled')

          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted 6 alpha characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')
          cy.get('button[id="btn__submit"]').click()
          cy.get('input[id="input__verification"]',{ timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('ASKTYU')
          cy.get('button[id="btn__submit"]').should('be.disabled')
           
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted less than 6 alpha characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')

          cy.get('button[id="btn__submit"]').click()
           
          cy.get('input[id="input__verification"]',{ timeout: 12000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('ASK')
          cy.get('button[id="btn__submit"]').should('be.disabled')
           
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted more than 6 alpha characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')
          cy.get('button[id="btn__submit"]').click()
           
          cy.get('input[id="input__verification"]', { timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('ASKIWERTUE')
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted 6 alpha numeric characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')
          cy.get('button[id="btn__submit"]').click()
           
          cy.get('input[id="input__verification"]', { timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('PO124U')
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted more than 6 alpha numeric characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')

          cy.get('button[id="btn__submit"]').click()        
          cy.get('input[id="input__verification"]', { timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('PO12YTURE9')
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted less than 6 alpha numeric characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')

          cy.get('button[id="btn__submit"]').click()
          cy.get('input[id="input__verification"]', { timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('P01R')
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted 6 special characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')
          cy.get('button[id="btn__submit"]').click()

          cy.get('input[id="input__verification"]', { timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('!@#$%^')
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted more than 6 special characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')

          cy.get('button[id="btn__submit"]').click()
          cy.get('input[id="input__verification"]', { timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('!@#$()%^')
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

        it('should have inputted less than 6 special characters', () => {  
          cy.get('mat-select[id="mat-select-0"]').click()
          cy.get('mat-option[id="mat-option-168"]').click()

          cy.get('span[class="hint__item"]').should('be.visible')
          cy.get('span[class="hint__item"]').contains('Enter mobile number to verify account')
          cy.get('input[id="input__mobile"]').click().type('9278923511')

          cy.get('button[id="btn__submit"]').click()
          cy.get('input[id="input__verification"]', { timeout: 20000 }).should('be.visible')
          cy.get('input[id="input__verification"]').click()
          cy.get('input[id="input__verification"]').type('!@#^')
          cy.get('button[id="btn__submit"]').should('be.disabled')
          cy.get('span[class="error__message ng-star-inserted"]').contains('Please enter a valid one-time password')
        })

      })

  }) 

}) 