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

exports.findBooksWithTitle = findBooksWithTitle
exports.findBookWithISBN = findBookWithISBN
exports.addBook = addBook