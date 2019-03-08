const authorRepository = require('../DAL/author-repository')
const validator = require('./validation')

const requiredAuthorKeys = [
    "ID",
    "firstName",
    "lastName",
    "birthYear"
]

function findAuthorsWithName(string, callback) {
    authorRepository.findAuthorsWithName(string).then(authors => {
        callback(authors)
    }).catch(error => {
        callback(null, error)
    })
}

function getAuthorWithId(id, callback) {
    authorRepository.getAuthorWithId(id).then(author => {
        callback(author)
    }).catch(error => {
        callback(null, error)
    })
}

function addAuthor(author, callback) {

    const errors = validator.validateAuthor(author)
    const missingkeys = validator.getMissingKeys(author, requiredAuthorKeys
    )
    for (key of missingkeys) {
        errors.push("Nothing entered in " + key)
    }
    if (errors) {
        callback(null, errors)
    } else {

        authorRepository.addAuthor(author).then(author => {
            callback(author)
        }).catch(error => {
            callback(null, error)
        })
    }
    
}

function editAuthor(newValues, callback) {
    const errors = validator.validateAuthor(newValues)
    if (errors.length > 0) {
        callback(null, errors)
    } else {
        authorRepository.editAuthor(newValues).then(author => {
            callback(author)
        }).catch(error => {
            callback(null, error)
        })
    }
}

function findAuthorsWithBookISBN(ISBN) {
    return authorRepository.findAuthorsWithBookISBN(ISBN).then(authors => {
        return authors
    }).catch(error => {
        throw error
    })
}

exports.findAuthorsWithName = findAuthorsWithName
exports.getAuthorWithId = getAuthorWithId
exports.addAuthor = addAuthor
exports.editAuthor = editAuthor
exports.findAuthorsWithBookISBN = findAuthorsWithBookISBN