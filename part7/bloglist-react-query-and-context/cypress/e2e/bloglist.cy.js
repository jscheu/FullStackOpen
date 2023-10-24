describe('Blog app', function() {
  beforeEach(function() {
    //clear test database
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    //create a user
    const user = {
      name: 'Josh',
      username: 'superuser',
      password: 'superpassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('superuser')
      cy.get('#password').type('superpassword')
      cy.get('#login-button').click()

      cy.contains('blogs')
    })

    it('fails with wrong credentials, notification has red border', function() {
      cy.get('#username').type('superuser')
      cy.get('#password').type('wrong password')
      cy.get('#login-button').click()
      //check for error message
      cy.contains('wrong username or password')
      //check for red border on notification object
      cy.get('.error').should('have.css', 'border-color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      //log in user
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'superuser', password: 'superpassword'
      }).then(response => {
        localStorage.setItem('loggedBloglistUser', JSON.stringify(response.body))
        return cy.visit('http://localhost:5173')
      })
    })

    it('a blog can be created', function() {
      //open blog form
      cy.contains('new blog').click()
      //submit new blog
      cy.get('input[placeholder="title"]').type('a new blog was created')
      cy.get('input[placeholder="author"]').type('some guy')
      cy.get('input[placeholder="url"]').type('http://some.url')
      cy.contains('button', 'create').click()
      //check for existence of new blog on the list
      cy.contains('a new blog was created')
    })

    describe('when there are initially blogs in the database', function() {
      beforeEach(function() {
        cy.window().then(function(win) {
          const titles = ['first blog', 'second blog', 'third blog']
          const loggedUser = JSON.parse(win.localStorage.getItem('loggedBloglistUser'));
          const token = loggedUser.token;
          
          let likes = 0
          return cy.wrap(titles).each(title => {
            const content = {
              title: title,
              author: 'some guy',
              url: 'http://some.url',
              likes: likes++
            }
  
            return cy.request({
              method: 'POST',
              url: 'http://localhost:3003/api/blogs',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: content
            })
          }).then(function() {
            cy.visit('http://localhost:5173')
          })
        })
      })

      it('a user can like a blog', function() {
        cy.intercept({
          method: 'PUT',
          url: '**/api/blogs/*'
        }).as('likeBlog')

        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('button')
          .contains('view')
          .click()

        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('.blog-details button')
          .contains('like')
          .click()

        cy.wait('@likeBlog')

        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('.blog-details div')
          .contains(/^likes: \d+/)
          .should((likeDiv) => {
            const text = likeDiv.text();
            const numberOfLikes = parseInt(text.split(': ')[1], 10);
            expect(numberOfLikes).to.eq(1);
          })
      })

      it('the user who created the blog can delte it', function() {
        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('button')
          .contains('view')
          .click()

        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('.blog-details button')
          .contains('remove')
          .click()

        cy.get('.blog')
          .contains('first blog')
          .should('not.exist')
      })

      it('only creator can see remove button', function() {
        //superuser is logged in at this point
        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('button')
          .contains('view')
          .click()

        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('.blog-details button')
          .contains('remove')

        //log out
        cy.get('#logout-button').click()

        //create a new user and log in
        const altUser = {
          name: 'alt',
          username: 'altuser',
          password: 'altpassword'
        }
        cy.request('POST', 'http://localhost:3003/api/users', altUser)
          .then(function() {
            cy.request('POST', 'http://localhost:3003/api/login', {
              username: 'altuser', password: 'altpassword'
            })
          })
          .then(response => {
            localStorage.setItem('loggedBloglistUser', JSON.stringify(response.body))
            return cy.visit('http://localhost:5173')
          })

        //alt user is logged in at this point
        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('button')
          .contains('view')
          .click()

        cy.get('.blog')
          .contains('first blog')
          .parent()
          .find('.blog-details button')
          .contains('remove')
          .should('not.exist')
      })

      it('should display blogs in descending order of likes', function() {
        //make all blog details visible
        cy.get('.blog').each(function($blog) {
          cy.wrap($blog)
            .find('button')
            .contains('view')
            .click()
        })

        //ensure they are rendered in the correct order
        cy.get('.blog').eq(0).should('contain', 'third blog')
        cy.get('.blog').eq(1).should('contain', 'second blog')
        cy.get('.blog').eq(2).should('contain', 'first blog')
      })
    })
  })
})