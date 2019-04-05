const express = require("express")
const authorManager = require("../../BLL/author-manager")
const bookManager = require("../../BLL/book-manager")
const authorization = require("../../BLL/authorization")

const AUTHORS_PER_PAGE = 10

const router = express.Router()

router.get("/add", (req, res) => {
    let model = { searched: false }

    const userId = req.session.userId
    authorization.getAccessLevelOfAdministratorId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.authors.add.includes(accessLevel)) {
            const model = {
                code: 403,
                message: "Not authorized to add authors"
            }
            res.render("error-page.hbs", model)
        } else {
            res.render("newAuthor.hbs", model)
        }
    }).catch(error => {
        console.log(error)
        const model = {
            code: 500,
            message: "Internal server error"
        }
        res.render("error-page.hbs", model)
    })

})

router.post('/add', (req, res) => {
    let model = { searched: false }

    const userId = req.session.userId

    authorManager.addAuthor(req.body, userId, (validationErrors, error, author) => {
        if (validationErrors.length > 0) {
            model = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                validationError: true,
                errors: validationErrors
            }
            res.render("newAuthor.hbs", model)

        } else if (error) {
            res.render("error-page.hbs", error)

        } else {
            const model = {
                id: author.get('id'),
                firstName: author.get('firstName'),
                lastName: author.get('lastName'),
                birthYear: author.get('birthYear'),
                admin: true
            }
            res.render("author.hbs", model)
        }
    })
})

router.get('/search', function (req, res) {
    let model = { searched: false }

    if (0 < Object.keys(req.query).length) {

        const search = req.query.search
        const page = req.query.page

        authorManager.findAuthorsWithName(search).then(foundAuthors => {
            let authors = []
            for (author of foundAuthors) {
                authors.push({
                    id: author.get('id'),
                    firstName: author.get('firstName'),
                    lastName: author.get('lastName'),
                    birthYear: author.get('birthYear')
                })
            }

            const amountOfPages = Math.floor(foundAuthors.length / AUTHORS_PER_PAGE)
            if (page) {
                const startIndex = (page - 1) * AUTHORS_PER_PAGE
                const endIndex = startIndex + AUTHORS_PER_PAGE
                foundAuthors = foundAuthors.slice(startIndex, endIndex)
            } else {
                page = 1
                foundAuthors = foundAuthors.slice(0, AUTHORS_PER_PAGE)
            }

            const paginationWithDots = pagination.getPaginationWithDots(parseInt(page), amountOfPages)

            model = {
                searched: true,
                authors: authors,
                pagination: paginationWithDots,
                search: search,
                page: page
            }
            res.render("search-authors.hbs", model)

        }).catch(error => {
            console.log(error)
            model = {
                code: 500,
                message: "Internal server error"
            }
            res.render("error-page.hbs", model)
        })
    } else {
        res.render("search-authors.hbs", model)
    }
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    const userId = req.session.userId

    authorManager.getAuthorWithId(id).then(author => {

        bookManager.findBooksWithAuthorId(id).then(foundBooks => {
            let books = []
            for (book of foundBooks) {
                books.push({
                    ISBN: book.get('ISBN'),
                    title: book.get('title'),
                    signID: book.get('signID'),
                    publicationYear: book.get('publicationYear'),
                    publicationInfo: book.get('publicationInfo'),
                    pages: book.get('pages')
                })
            }
            let model = {
                id: author.get('id'),
                firstName: author.get('firstName'),
                lastName: author.get('lastName'),
                birthYear: author.get('birthYear'),
                books: books
            }
            if (userId) {
                authorization.getAccessLevelOfAdministratorId(userId).then(accessLevel => {

                    for (let i = 1; i <= accessLevel; i++) {
                        model[authorization.accessLevels[i]] = true
                    }
                    res.render("author.hbs", model)
                })
            } else {
                res.render("author.hbs", model)
            }

        }).catch(error => {
            console.log(error)
            const model = {
                code: 500,
                message: "Internal server error"
            }
            res.render("error-page.hbs", model)
        })

    }).catch(error => {
        console.log(error)
        const model = {
            code: 500,
            message: "Internal server error"
        }
        res.render("error-page.hbs", model)
    })
})



router.post('/edit/:id', (req, res) => {

    const userId = req.session.userId
    let newValues = req.body
    newValues.id = req.params.id

    authorManager.editAuthor(newValues, userId, (validationErrors, error, author) => {
        if (validationErrors.length) {
            model = {
                id: req.params.id,
                validationError: true,
                errors: validationErrors
            }
            res.render("edit-author.hbs", model)

        } else if (error) {
            res.render("error-page.hbs", error)

        } else {
            bookManager.findBooksWithAuthorId(author.id).then(foundBooks => {
                const model = {
                    id: author.get('id'),
                    firstName: author.get('firstName'),
                    lastName: author.get('lastName'),
                    birthYear: author.get('birthYear'),
                    books: foundBooks
                }

                res.render("author.hbs", model)
            }).catch(() => {
                const model = {
                    id: author.get('id'),
                    firstName: author.get('firstName'),
                    lastName: author.get('lastName'),
                    birthYear: author.get('birthYear'),
                    bookErrorMessage: "There was an error fetching books :("
                }
                res.render("author.hbs", model)
            })
        }
    })

})

router.get('/edit/:id', (req, res) => {
    const userId = req.session.userId
    const authorId = req.params.id

    authorization.getAccessLevelOfAdministratorId(userId).then(accessLevel => { 
        if (!authorization.privilegiesOfAccessLevel.authors.edit.includes(accessLevel)) {
            const model = {
                code: 403,
                message: "Need to be logged in as administrator to edit author"
            }
            res.render("error-page.hbs", model)
        }
        else {
            authorManager.getAuthorWithId(authorId).then(author => {
                const model = {
                    id: author.get('id'),
                    firstName: author.get('firstName'),
                    lastName: author.get('lastName'),
                    birthYear: author.get('birthYear')
                }
                res.render("edit-author.hbs", model)
            })

        }
    }).catch(error => {
        console.log(error)
        const model = {
            code: 500,
            message: "Internal server error"
        }
        res.render("error-page.hbs", model)
    })

})

module.exports = router