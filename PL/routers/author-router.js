const express = require("express")
const authorManager = require("../../BLL/author-manager")
const bookManager = require("../../BLL/book-manager")

const router = express.Router()


router.get('/search', function (req, res) {
    model = { searched: false }

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

        }).catch(() => {
            error = {
                code: 500,
                message: "Internal server error"
            }
        })
    } else {
        res.render("search-authors.hbs", model)
    }
})

router.get('/:id', (req, res) => {

    const id = req.params.id
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
            author = {
                id: author.get('id'),
                firstName: author.get('firstName'),
                lastName: author.get('lastName'),
                birthYear: author.get('birthYear'),
                books: books
            }
            res.render("author.hbs", author)

        }).catch(() => {
            error = {
                code: 500,
                message: "Internal server error"
            }
        })

    }).catch(() => {
        error = {
            code: 500,
            message: "Internal server error"
        }
    })

    // const id = req.params.id
    // dbAuthors.getAuthor(id).then(author => {
    //     if (author) {
    //         dbAuthors.findBooksFromAuthor(id).then(foundBooks => {
    //             const authorModel = {
    //                 id: id,
    //                 name: author.get('firstName') + " " + author.get('lastName'),
    //                 birthYear: author.get('birthYear'),
    //                 books: foundBooks
    //             }
    //             res.render("author.hbs", authorModel)
    //         })
    //     } else {
    //         console.log("author är null!");
    //         res.render("author.hbs")
    //     }
    // })
})

router.post('/', (req, res) => {
    let model = { searched: false }

    authorManager.addAuthor(req.body, (validationErrors, serverError, author) => {
        if (validationErrors.length > 0) {
            model = {
                validationError: true,
                errors: validationErrors
            }
            res.render("search-authors.hbs", model)
        } else if (serverError) {
            error = {
                code: 500,
                message: "Internal server error"
            }
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
                console.log("Fel i find books");
                // TODO: render author but error message on books?
            })
        }
    })

    // const errors = validation.validateAuthor(req.body)

    // if (0 < errors.length) {
    //     model.errors = errors
    //     model.postError = true
    //     res.render("search-authors.hbs", model)
    // } else {
    //     dbAuthors.addAuthor({
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         birthYear: req.body.birthYear
    //     }).then(author => {
    //         if (author) {
    //             dbAuthors.findBooksFromAuthor(author.id).then(foundBooks => {
    //                 const model = {
    //                     id: author.get('id'),
    //                     name: author.get('firstName') + " " + author.get('lastName'),
    //                     birthYear: author.get('birthYear'),
    //                     books: foundBooks
    //                 }
    //                 res.render("author.hbs", model)
    //             })
    //         } else {

    //             model = {addAuthorFailute: true}
    //             res.render("author.hbs", model)
    //         }
    //     })
    // }
})

router.post('/edit/:id', (req, res) => {

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
            error = {
                code: 500,
                message: "Internal server error"
            }
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

    // const body = removeEmptyValues(req.body)
    // const errors = validation.validateBook(body)

    // if (0 < Object.keys(errors)) {
    //     model = {
    //         failedValidation: true,
    //         errors: errors
    //     }
    //     res.render('edit-author.hbs', model)
    // } else {
    //     dbAuthors.editAuthor(body)
    //     res.render("edit-author.hbs")
    // }
})

router.get('/edit/:id', (req, res) => {
    model = { id: req.params.id }
    res.render("edit-author.hbs", model)
})

module.exports = router