const express = require("express")
const bookManager = require("../../BLL/book-manager")
const authorManager = require("../../BLL/author-manager")

const router = express.Router()

router.get("/new", (req, res) => {
    const model = { searched: false }

    const authorId = req.query.id;
    console.log(authorId);
    

    res.render("newBook.hbs", model);
})

router.post("/new", (req, res) => {

    const model = { searched: false }

    bookManager.addBook(req.body, (book, errors) => {
        if (errors.length) {
            model.errors = errors
            model.postError = true
            res.render("newBook.hbs", model)
        }
    })
})

router.get('/search', function (req, res) {
    model = { searched: false }

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
            error = {
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
            const model = {
                ISBN: book.get('ISBN'),
                title: book.get('title'),
                signID: book.get('signID'),
                publicationYear: book.get('publicationYear'),
                publicationInfo: book.get('publicationInfo'),
                pages: book.get('pages'),
                authors: authors
            }
            res.render("book.hbs", model)
        }).catch(() => {
            // Rendera book men felmeddelande på authors?
        })

    }).catch(() => {
        error = {
            code: 500,
            message: "Internal server error"
        }
        // TODO: error page
    })
})

router.post('/', (req, res) => {
    model = { searched: false }

    bookManager.addBook(req.body, (validationErrors, serverError, book) => {
        if (validationErrors.length) {
            model.errors = validationErrors
            model.validationError = true
            res.render("search-books.hbs", model)
        } else if (serverError) {
            console.log("Servererror", serverError);

            error = {
                code: 500,
                message: "Internal server error"
            }
            // TODO: error page
        } else {
            authorManager.findAuthorsWithBookISBN(book.ISBN).then(foundAuthors => {
                const model = {
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

    // if (0 < errors.length) {
    //     model.errors = errors
    //     model.postError = true
    //     res.render("search-books.hbs", model)
    // } else {
    //     dbBook.addBook({
    //         ISBN: req.body.ISBN,
    //         title: req.body.title,
    //         signID: req.body.signID,
    //         publicationYear: req.body.publicationYear,
    //         publicationInfo: req.body.publicationCity + " : " + req.body.publicationCompany + ", " + req.body.publicationYear,
    //         pages: req.body.pages
    //     }).then(book => {
    //         if (book) {
    //             dbBook.findAuthorsOfBook(book.ISBN).then(foundAuthors => { // TODO: denna kod är kopierad och klistrad. Kanske göra funktion? 
    //                 const bookModel = {
    //                     ISBN: book.get('ISBN'),
    //                     title: book.get('title'),
    //                     signID: book.get('signID'),
    //                     publicationYear: book.get('publicationYear'),
    //                     publicationInfo: book.get('publicationInfo'),
    //                     pages: book.get('pages'),
    //                     authors: foundAuthors
    //                 }
    //                 res.render("book.hbs", bookModel)
    //             })
    //         } else {
    //             model = {addBookFailure: true}
    //             res.render("books.hbs", model)
    //         }
    //     })
    // }

})

router.get('/edit/:ISBN', (req, res) => {
    const ISBN = req.params.ISBN
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

})

router.post('/edit/:ISBN', (req, res) => {
    const newValues = req.body
    newValues.ISBN = req.params.ISBN

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
})

module.exports = router