const authorRepository = require('../DAL/author-repository')
const validator = require('./validation')

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

exports.findAuthorsWithName = findAuthorsWithName
exports.getAuthorWithId = getAuthorWithId
exports.addAuthor = addAuthor