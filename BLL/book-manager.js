const bookRepository = require('../DAL/book-repository')
const validator = require('./validation')

const validBookKeys = [
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
        console.log("Error: " + error);
        throw "500 server error"
    })
}

function findBooksWithAuthorId(id) {
    
}

function addBook(book, callback) {
    let errors = validator.validateBook(book)
    const missingKeys = validator.getMissingKeys(book, validBookKeys)
    for (key of missingKeys) {
        errors.push("Nothing entered in " + key)
    }

    if (errors) {
        callback(null, errors)
    } else {

        bookRepository.addBook(book).then(book => {
            callback(book)
        }).catch(error => {
            callback(null, error) // TODO: kanske skicka ett error objekt? Typ {code: 500, message: internal server error}
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