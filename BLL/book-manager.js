const bookRepository = require('../DAL/book-repository')
const validator = require('./validation')

const requiredBookKeys = [
    "ISBN",
    "title",
    "signID",
    "publicationYear",
    "publicationCity",
    "publicationCompany",
    "pages"
]

// ------------ Functions ----------------

function findBooksWithTitle(string) {
    return bookRepository.findBooksWithTitle(string).then(book => {
        return book
    }).catch(error => {
        throw error
    })
}

function findBookWithISBN(ISBN) {
    return bookRepository.findBookWithISBN(ISBN).then(book => {
        return book
    }).catch(error => {
        throw error
    })
}

function findBooksWithAuthorId(id) {

    return bookRepository.findBooksWithAuthorId(id).then(books => {
        return books
    }).catch(error => {
        throw error
    })
}

function addBook(book, callback) {
    let errors = validator.validateBook(book)
    const missingKeys = validator.getMissingKeys(book, requiredBookKeys)
    for (key of missingKeys) {
        errors.push("Nothing entered in " + key)
    }

    if (errors.length) {
        callback(errors)
    } else {

        bookRepository.addBook(book).then(addedBook => {
            callback([], null, addedBook)

        }).catch(error => {
            callback([], error)
        })
    }
}

function editBook(book, callback) {
    const errors = validator.validateBook(book)
    if (errors.length > 0) {
        callback(errors)
    } else {

        bookRepository.editBook(book).then(book => {
            callback([], book)
        }).catch(error => {
            // TODO: callback("Passande felmeddelande")
        })
    }
}

exports.findBooksWithTitle = findBooksWithTitle
exports.findBookWithISBN = findBookWithISBN
exports.findBooksWithAuthorId = findBooksWithAuthorId
exports.addBook = addBook
exports.editBook = editBook