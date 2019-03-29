const express = require("express")
const bookManager = require("../../BLL/book-manager")
const authorManager = require("../../BLL/author-manager")
const authorization = require("../../BLL/authorization")

const router = express.Router()

router.get("/new", (req, res) => {
    const userId = req.session.userId
    if (!userId) {
        let error = {
            code: 403,
            message: "You need to be logged in as administrator to add author"
        }
        // TODO: error page
    }
    else {
        res.render("newBook.hbs")
    }
})

router.post("/new", (req, res) => {
    const userId = req.session.userId
    if (!userId) {
        let error = {
            code: 403,
            message: "You need to be logged in as administrator to add author"
        }
        // TODO: error page
    }
    else {
        let model = {}
        bookManager.addBook(req.body, (validationErrors, serverError, book) => {
            if (validationErrors.length) {
                model.errors = validationErrors
                model.validationError = true
                res.render("newBook.hbs", model)
            }
            else if (serverError) {
                    const error = {
                        code: 500,
                        message: "Internal server error"
                    }
                // TODO: add error page
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
    }  
    
}) 
    
    router.get('/search', function (req, res) {
    let model = { searched: false }

    if (0 < Object.keys(req.query).length) {

        bookManager.findBooksWithTitle(req.query.search).then(books => {
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
            model = {
                searched: true,
                books: foundBooks
            }
            res.render("search-books.hbs", model)
        }).catch(() => {
            let error = {
                code: 500,
                message: "Internal server error"
            }
            // TODO: error page
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
        // TODO: error page
    })
})


router.post('/', (req, res) => {
    let model = { searched: false } 

    const userId = req.session.userId

    if (!userId) {
        const error = {
            code: 403,
            message: "You need to be logged in to add book"
        }
    }
    else {
        bookManager.addBook(req.body, (validationErrors, serverError, book) => {
            if (validationErrors.length) {
                model.errors = validationErrors
                model.validationError = true
                res.render("search-books.hbs", model) // Replace with motsvarande in newBook
            } else if (serverError) {
                console.log("Servererror", serverError);
    
                const error = {
                    code: 500,
                    message: "Internal server error"
                }
                // TODO: error page
            } else {
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
                }).catch(() => {
                    error = {
                        code: 500,
                        message: "Internal server error"
                    }
                    // TODO: error page
                })
            }
        })
    }

})

router.get('/edit/:ISBN', (req, res) => {
    const ISBN = req.params.ISBN
    const userId = req.session.userId

    if (!userId) {
        const error = {
            code: 403,
            message: "You need to be logged in to edit book"
        }
    }
    else {
        bookManager.findBookWithISBN(ISBN).then(book => {
            const model = {
                ISBN: book.get('ISBN'),
                title: book.get('title'),
                signID: book.get('signID'),
                publicationYear: book.get('publicationYear'),
                publicationInfo: book.get('publicationInfo'),
                pages: book.get('pages'),
            }
            res.render("edit-book.hbs", model)
        }).catch(() => {
            const error = {
                code: 404,
                message: "No book with ISBN " + ISBN + " found"
            }
            // TODO: error page
        })
    }
    

})

router.post('/edit/:ISBN', (req, res) => {
    const newValues = req.body
    newValues.ISBN = req.params.ISBN
const userId = req.session.userId 

    if (!userId) {
        const error = {
            code: 403,
            message: "You need to be logged in to edit book"
        }
    }
    else {
        bookManager.editBook(newValues, (validationErrors, serverError, book) => {
            if (validationErrors.length) {
                model = {
                    ISBN: ISBN,
                    validationError: true,
                    errors: validationErrors
                }
                res.render("edit-book.hbs", model)
            } else if (serverError) {
                const error = {
                    code: 500,
                    message: "Internal server error"
                }
                // TODO: error page
            } else {
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
    }
    
})

module.exports = router