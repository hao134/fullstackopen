describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })
  it('login form is shown', function() {
    cy.visit('')
    cy.contains('log in').click()
    cy.contains('log in to application')
    cy.contains('cancel')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.contains('Matti Luukkainen logged in')
    })

    it('fail login with wrong password', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'error: invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('author')
      cy.get('#url').type('www.example.com')
      cy.get('#create-blog').click()
      cy.contains('a blog created by cypress')
    })

    describe('and several blogs exist', function() {
      beforeEach(function () {
        cy.createBlog({
          title: 'first blog',
          author: 'cypress',
          url: 'https://www.test.com/',
        })
        cy.createBlog({
          title: 'second blog',
          author: 'cypress',
          url: 'https://www.test.com/',
        })
        cy.createBlog({
          title: 'third blog',
          author: 'cypress',
          url: 'https://www.test.com/',
        })
      })
      it('confirms users can like a blog', function() {
        cy.contains('second blog').parent().find('#show-button').click()
        cy.get('#like-button').click()
        cy.contains('likes: 1')
      })
      it('ensure that the user who created a blog can delete it', function() {
        cy.contains('second blog').parent().find('#show-button').click()
        cy.get('#delete-button').click()
        cy.get('html').should('not.contain', 'second blog')
      })

      it('they are ordered by the number of likes in descending order', async function () {
        cy.contains('second blog').parent().find('#show-button').click()
        cy.get('#like-button').click().wait(500).click().wait(500).click().wait(500)
        cy.contains('second blog').parent().find('#show-button').click()
        cy.contains('third blog').parent().find('#show-button').click()
        cy.get('#like-button').click().wait(500).click().wait(500)
        cy.contains('third blog').parent().find('#show-button').click()
        cy.contains('first blog').parent().find('#show-button').click()
        cy.get('#like-button').click().wait(500)
        cy.contains('first blog').parent().find('#show-button').click()

        cy.get('.blog').eq(0).should('contain', 'second blog')
        cy.get('.blog').eq(1).should('contain', 'third blog')
        cy.get('.blog').eq(2).should('contain', 'first blog')
      })
    })
  })
})