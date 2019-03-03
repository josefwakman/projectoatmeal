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
            authorManager.findAuthorsWithBookISBN(ISBN).then(foundAuthors => { // TODO: denna kod är kopierad och klistrad. Kanske göra funktion? 
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

    const errors = validation.validateBook(req.body)
    const missingKeys = validation.getMissingBookKeys(req.body)
    for (key of missingKeys) {
        errors.push("Nothing entered as " + key)
    }

    if (0 < errors.length) {
        model.errors = errors
        model.postError = true
        res.render("search-books.hbs", model)
    } else {
        dbBook.addBook({
            ISBN: req.body.ISBN,
            title: req.body.title,
            signID: req.body.signID,
            publicationYear: req.body.publicationYear,
            publicationInfo: req.body.publicationCity + " : " + req.body.publicationCompany + ", " + req.body.publicationYear,
            pages: req.body.pages
        }).then(book => {
            if (book) {
                dbBook.findAuthorsOfBook(book.ISBN).then(foundAuthors => { // TODO: denna kod är kopierad och klistrad. Kanske göra funktion? 
                    const bookModel = {
                        ISBN: book.get('ISBN'),
                        title: book.get('title'),
                        signID: book.get('signID'),
                        publicationYear: book.get('publicationYear'),
                        publicationInfo: book.get('publicationInfo'),
                        pages: book.get('pages'),
                        authors: foundAuthors
                    }
                    res.render("book.hbs", bookModel)
                })
            } else {
                model = {addBookFailure: true}
                res.render("books.hbs", model)
            }
        })
    }

})


router.get('/edit/:ISBN', (req, res) => {
    const isbn = req.params.ISBN
    const book = dbBook.findBookWithISBN(isbn)

    const model = {
        book: book
    }

    res.render("edit-book.hbs", model)
})

router.post('/edit', (req, res) => {
    const body = removeEmptyValues(req.body)
    const errors = validation.validateBook(body)

    if (0 < Object.keys(errors)) {
        model = { 
            failedValidation: true,
            errors: errors
        }
        res.render('edit-book.hbs', model)
    } else {
        dbBook.editBook(body)
        res.render("edit-book.hbs")
    }
})

module.exports = router