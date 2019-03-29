const express = require("express")
const authorManager = require("../../BLL/author-manager")
const bookManager = require("../../BLL/book-manager")
const authorization = require("../../BLL/authorization")

const router = express.Router()

router.get("/add", (req, res) => {
    let model = { searched: false }

    const userId = req.session.userId
    if (!userId) {
        model = {
            code: 403,
            message: "You need to be logged in as administrator to add author"
        }
        res.render("error-page.hbs", model)
    }
    else {
        res.render("newAuthor.hbs", model)
    }

})

router.post('/add', (req, res) => {
    let model = { searched: false }

    const userId = req.session.userId
    if (!userId) {
        model = {
            code: 403,
            message: "You need to be logged in as administrator to add author"
        }
        res.render("error-page.hbs", model)
    }
    else {
        authorManager.addAuthor(req.body, (validationErrors, serverError, author) => {
            if (validationErrors.length > 0) {
                model = {
                    validationError: true,
                    errors: validationErrors
                }
                res.render("search-authors.hbs", model)
            } else if (serverError) {
                console.log("Servererror:", serverError);

                error = {
                    code: 500,
                    message: "Internal server error"
                }
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
    }

})

router.get('/search', function (req, res) {
    let model = { searched: false }

    if (0 < Object.keys(req.query).length) {

        authorManager.findAuthorsWithName(req.query.search).then(foundAuthors => {
            let authors = []
            for (author of foundAuthors) {
                authors.push({
                    id: author.get('id'),
                    firstName: author.get('firstName'),
                    lastName: author.get('lastName'),
                    birthYear: author.get('birthYear')
                })
            }
            model = {
                searched: true,
                authors: authors
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
    if (!userId) {
        const model = {
            code: 403,
            message: "Need to be logged in as administrator to edit author"
        }
        res.render("error-page", model)
    }
    else {
        let newValues = req.body
        newValues.id = req.params.id

        authorManager.editAuthor(newValues, (validationErrors, serverError, author) => {
            if (validationErrors.length) {
                model = {
                    id: req.params.id,
                    validationError: true,
                    errors: validationErrors
                }
                res.render("edit-author.hbs", model)
            } else if (serverError) {
                console.log(serverError)
                model = {
                    code: 500,
                    message: "Internal server error"
                }
                res.render("error-page.hbs", model)
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
                    // TODO: render author but error message on books?
                })
            }
        })
    }

})

router.get('/edit/:id', (req, res) => {
    const userId = req.session.userId
    if (!userId) {
        const model = {
            code: 403,
            message: "Need to be logged in as administrator to edit author"
        }
        res.render("error-page.hbs", model)
    }
    else {
        const model = { id: req.params.id }
        res.render("edit-author.hbs", model)
    }

})

module.exports = router