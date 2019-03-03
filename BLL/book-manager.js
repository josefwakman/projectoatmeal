const bookRepository = require('../DAL/book-repository')

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

exports.findBooksWithTitle = findBooksWithTitle
exports.findBookWithISBN = findBookWithISBN