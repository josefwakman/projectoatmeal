const authorRepository = require('../DAL/author-repository')
const validator = require('./validation')

const validAuthorKeys = [
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
    const missingkeys = validator.getMissingKeys(author, validAuthorKeys)
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

exports.findAuthorsWithName = findAuthorsWithName
exports.getAuthorWithId = getAuthorWithId
exports.addAuthor = addAuthor
exports.editAuthor = editAuthor