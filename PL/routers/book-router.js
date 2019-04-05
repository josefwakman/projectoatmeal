const express = require("express")
const bookManager = require("../../BLL/book-manager")
const authorManager = require("../../BLL/author-manager")
const authorization = require("../../BLL/authorization")

const router = express.Router()

const pagination = require('../pagination')
const BOOKS_PER_PAGE = 10

router.get("/new", (req, res) => {
    const userId = req.session.userId

    authorization.getAccessLevelOfAdministratorId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.books.add.includes(accessLevel)) {
            const model = {
                code: 403,
                message: "Not authorized to add author"
            }
            res.render("error-page.hbs", model)
        }
        else {
            res.render("newBook.hbs")
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

router.post("/new", (req, res) => {
    const userId = req.session.userId

    let model = {}
    bookManager.addBook(req.body, userId, (validationErrors, error, book) => {
        if (validationErrors.length) {
            model.errors = validationErrors
            model.validationError = true
            res.render("newBook.hbs", model)
        }
        else if (error) {
            res.render("error-page.hbs", error)
        }
        else {
            model = {
                admin: true,
                ISBN: book.get('ISBN'),
                title: book.get('title'),
                signID: book.get('signID'),
                publicationYear: book.get('publicationYear'),
                publicationInfo: book.get('publicationInfo'),
                pages: book.get('pages'),
            }
            res.render("book.hbs", model)
        }
    })
})

router.get('/search', function (req, res) {
    let model = { searched: false }

    if (0 < Object.keys(req.query).length) {
        
        let page = req.query.page
        const search = req.query.search

        bookManager.findBooksWithTitle(search).then(books => {
            let foundBooks = []
            for (book of books) {
                foundBooks.push({
                    ISBN: book.get('ISBN'),
                    title: book.get('title'),
                    signID: book.get('signID'),
                    publicationYear: book.get('publicationYear'),
                    publicationInfo: book.get('publicationInfo'),
                    pages: book.get('pages'),
                })
            }

            const amountOfPages = Math.floor(foundBooks.length / BOOKS_PER_PAGE)
            if (page) {
                const startIndex = (page - 1) * BOOKS_PER_PAGE
                const endIndex = startIndex + BOOKS_PER_PAGE
                foundBooks = foundBooks.slice(startIndex, endIndex)
            } else {
                page = 1
                foundBooks = foundBooks.slice(0, BOOKS_PER_PAGE)
            }

            const paginationWithDots = pagination.pagination(page, amountOfPages)

            model = {
                searched: true,
                search: search,
                books: foundBooks,
                paginationWithDots: paginationWithDots,
                page: page
            }
            res.render("search-books.hbs", model)
        }).catch(error => {
            console.log(error)
            model = {
                code: 500,
                message: "Internal server error"
            }
            res.render("error-page.hbs", model)
        })

    } else {
        res.render("search-books.hbs", model)
    }
})

router.get('/:ISBN', (req, res) => {
    const ISBN = req.params.ISBN
    const userId = req.session.userId

    bookManager.findBookWithISBN(ISBN).then(book => {
        authorManager.findAuthorsWithBookISBN(ISBN).then(foundAuthors => {
            let authors = []
            for (author of foundAuthors) {
                authors.push({
                    id: author.get('id'),
                    firstName: author.get('firstName'),
                    lastName: author.get('lastName')
                })
            }
            let model = {
                ISBN: book.get('ISBN'),
                title: book.get('title'),
                signID: book.get('signID'),
                publicationYear: book.get('publicationYear'),
                publicationInfo: book.get('publicationInfo'),
                pages: book.get('pages'),
                authors: authors
            }
            if (userId) {
                authorization.getAccessLevelOfAdministratorId(userId).then(accessLevel => {

                    for (let i = 1; i <= accessLevel; i++) {
                        model[authorization.accessLevels[i]] = true
                    }
                    res.render("book.hbs", model)
                })
            }
            else {
                res.render("book.hbs", model)
            }
        }).catch(error => {
            console.log(error)
            // Rendera book men felmeddelande på authors?
        })

    }).catch(error => {
        console.log(error)
        model = {
            code: 500,
            message: "Internal server error"
        }
        res.render("error-page.hbs", model)
    })
})


router.post('/', (req, res) => {
    let model = { searched: false }

    const userId = req.session.userId


    bookManager.addBook(req.body, userId, (validationErrors, error, book) => {
        if (validationErrors.length) {
            model.errors = validationErrors
            model.validationError = true
            res.render("newBook.hbs", model) // Replace with motsvarande in newBook
        }
        else if (error) {
            res.render("error-page.hbs", error)
        }
        else {
            authorManager.findAuthorsWithBookISBN(book.ISBN).then(foundAuthors => {
                const model = {
                    admin: true,
                    ISBN: book.get('ISBN'),
                    title: book.get('title'),
                    signID: book.get('signID'),
                    publicationYear: book.get('publicationYear'),
                    publicationInfo: book.get('publicationInfo'),
                    pages: book.get('pages'),
                    authors: foundAuthors
                }
                res.render("book.hbs", model)
            })
        }
    }).catch(error => {
        console.log(error)
        model = {
            code: 500,
            message: "Internal server error"
        }
        res.render("error-page.hbs", model)
    })
})

router.get('/edit/:ISBN', (req, res) => {
    const ISBN = req.params.ISBN
    const userId = req.session.userId

    authorization.getAccessLevelOfAdministratorId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.books.edit.includes(accessLevel)) {
            const model = {
                code: 403,
                message: "Not authorized to edit books"
            }
            res.render("error-page.hbs", model)
        }
        else {
            bookManager.findBookWithISBN(ISBN).then(book => {
                if (!book) {
                    model = {
                        code: 404,
                        message: "No book with ISBN " + ISBN + " found"
                    }
                    res.render("error-page.hbs", model)
                }
                const model = {
                    ISBN: book.get('ISBN'),
                    title: book.get('title'),
                    signID: book.get('signID'),
                    publicationYear: book.get('publicationYear'),
                    publicationInfo: book.get('publicationInfo'),
                    pages: book.get('pages'),
                }
                res.render("edit-book.hbs", model)
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

router.post('/edit/:ISBN', (req, res) => {
    const newValues = req.body
    newValues.ISBN = req.params.ISBN
    const userId = req.session.userId

    
        bookManager.editBook(newValues, userId, (validationErrors, error, book) => {
            if (validationErrors.length) {
                model = {
                    ISBN: newValues.ISBN,
                    signID: newValues.signID,
                    publicationCity: newValues.publicationCity,
                    publicationCompany: newValues.publicationCompany,
                    publicationYear: newValues.publicationYear,
                    pages: newValues.pages,
                    validationError: true,
                    errors: validationErrors
                }
                res.render("edit-book.hbs", model)
            } 
            else if (error) {
                res.render("error-page.hbs", error)
            } 
            else {
                const model = {
                    ISBN: book.get('ISBN'),
                    title: book.get('title'),
                    signID: book.get('signID'),
                    publicationYear: book.get('publicationYear'),
                    publicationInfo: book.get('publicationInfo'),
                    pages: book.get('pages'),
                }
                authorManager.findAuthorsWithBookISBN(book.ISBN).then(foundAuthors => {
                    let authors = []
                    for (author of foundAuthors) {
                        authors.push({
                            id: author.get('id'),
                            firstName: author.get('firstName'),
                            lastName: author.get('lastName')
                        })
                    }
                    model.authors = authors
                    res.render("book.hbs", model)
                }).catch(() => {
                    console.log("Error i find authors with ISBN");
                    // TODO: render book page but error message on author?
                })
            }
        })
})

module.exports = router