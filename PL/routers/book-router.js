const express = require("express")
const bookManager = require("../../BLL/book-manager")
const authorManager = require("../../BLL/author-manager")
const validation = require("../../BLL/validation")

const router = express.Router()

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
        })

    } else {
        res.render("search-books.hbs", model)
    }
})

router.get('/:ISBN', (req, res) => {
    const ISBN = req.params.ISBN
    bookManager.findBookWithISBN(ISBN).then(book => {
        if (book) {
            authorManager.findAuthorsWithBookISBN(ISBN).then(foundAuthors => { 
                let authors = []
                for (author of foundAuthors) {
                    authors.push({
                        id: author.get('id'),
                        firstName: author.get('firstName'),
                        lastName: author.get('lastName')
                    })
                }
                console.log(authors);
                
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
            })

        } else {
            console.log("No book");
            //TODO: fix 404 page
            res.render("book.hbs") // langa in model med no book exists?
        }
    })
})


router.post('/', (req, res) => {
    model = { searched: false }

    bookManager.addBook(req.body, (book, errors) => {
        if (errors) {
            model.errors = errors
            model.postError = true
            res.render("search-books.hbs", model)
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
                // TODO: error handling. Kanske render book.hbs, men med ruta att authors could not be found (500)?
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
        res.render("edit-book.hbs", book)
    }).catch(() => {
        // TODO: error handling
    })

})

router.post('/edit/:ISBN', (req, res) => {
    const newValues = req.body
    newValues.ISBN = req.params.ISBN

    bookManager.editBook(newValues, (errors, book) => {
        if (errors) {
            model = {
                postFailed: true,
                errors: errors
            }
            res.render("search-books.hbs", model)
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
                // TODO: error handling
            })
        }
    }).catch(() => {
        // TODO: error handling
    })
})

module.exports = router