const bookRepository = require('../DAL/book-repository')

function findBookWithName(string) {
    bookRepository.findBooksWithTitle(string).then(book => {
        return book
    }).catch(error => {
        throw error
    })
}

function findBookWithISBN(ISBN) {
    bookRepository.findBookWithISBN(ISBN).then(book => {
        return book
    }).catch(error => {
        console.log("Error: " + error);
        throw "500 server error"
    })
}

exports.findBookWithName = findBookWithName
exports.findBookWithISBN = findBookWithISBN