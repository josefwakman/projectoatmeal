const bookRepository = require('../DAL/book-repository')
const validator = require('./validation')
const authorization = require('./authorization')

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

function addBook(book, userId, authorId, callback) {

    authorization.getAccessLevelOfAdministratorId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.books.add.includes(accessLevel)) {
            const error = {
                code: 403,
                message: "Not authorized to add book"
            }
            callback([], error)
        }
        else {
            let errors = validator.validateBook(book)

            const missingKeys = validator.getMissingKeys(book, requiredBookKeys)
            for (key of missingKeys) {
                errors.push("Nothing entered in " + key)
            }

            if (errors.length) {
                callback(errors)

            } else {
                book.publicationInfo = book.publicationCity + " : " + book.publicationCompany + ", " + book.publicationYear
                bookRepository.addBook(book).then(addedBook => {

                    const newBook = {
                    book: addedBook,
                    author: authorId
                }

                    callback([], null, addedBook)

                    bookRepository.addBookForAuthor(newBook.book, newBook.author);

                })
            }
        }
    }).catch(error => {
        callback([], error)
    })
}

function editBook(newValues, userId, callback) {

    authorization.getAccessLevelOfAdministratorId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.books.add.includes(accessLevel)) {
            const error = {
                code: 403,
                message: "Not authorized to add book"
            }
            callback([], error)
        }
        else {
            newValues = validator.removeEmptyValues(newValues)
            const errors = validator.validateBook(newValues)
            if (errors.length > 0) {
                callback(errors)
            }
            else {
                bookRepository.editBook(newValues).then(book => {
                    callback([], null, book)

                })
            }
        }
    }).catch(error => {
        callback([], error)
    })
}

exports.findBooksWithTitle = findBooksWithTitle
exports.findBookWithISBN = findBookWithISBN
exports.findBooksWithAuthorId = findBooksWithAuthorId
exports.addBook = addBook
exports.editBook = editBook