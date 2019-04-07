const authorRepository = require('../DAL/author-repository')
const validator = require('./validation')
const authorization = require('./authorization')
const { getAccessLevelOfAdministratorWithId } = require('../DAL/administrator-repository')

const requiredAuthorKeys = [
    "firstName",
    "lastName"
]

function findAuthorsWithName(string) {
    return authorRepository.findAuthorsWithName(string)
}

function getAuthorWithId(id) {
    return authorRepository.getAuthorWithId(id)
}

function addAuthor(author, userId, callback) {

    getAccessLevelOfAdministratorWithId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.authors.add.includes(accessLevel)) {
            error = {
                code: 403,
                message: "Not authorized to add author"
            }
            callback([], error)
        }
        else {
            const errors = validator.validateAuthor(author)
            const missingkeys = validator.getMissingKeys(author, requiredAuthorKeys)
            for (key of missingkeys) {
                errors.push("Nothing entered in " + key)
            }
            if (errors.length) {
                callback(errors)
            }
            else {

                authorRepository.addAuthor(author).then(author => {
                    callback([], null, author)
                }).catch(error => {
                    callback([], error)
                })
            }
        }
    })

}

function editAuthor(newValues, userId, callback) {

    getAccessLevelOfAdministratorWithId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.authors.edit.includes(accessLevel)) {
            const error = {
                code: 403,
                message: "Not authorized to edit authors"
            }
            callback([], error)
        }
        else {
            newValues = validator.removeEmptyValues(newValues)
            const errors = validator.validateAuthor(newValues)
            if (errors.length > 0) {
                callback(errors)

            } else {
                authorRepository.editAuthor(newValues).then(author => {
                    callback([], null, author)
                }).catch(serverError => {
                    console.log(serverError)
                    const error = {
                        code: 500,
                        message: "Internal server error"
                    }
                    callback([], error)
                })
            }
        }
    })
}

function findAuthorsWithBookISBN(ISBN) {
    return authorRepository.findAuthorsWithBookISBN(ISBN)
}

exports.findAuthorsWithName = findAuthorsWithName
exports.getAuthorWithId = getAuthorWithId
exports.addAuthor = addAuthor
exports.editAuthor = editAuthor
exports.findAuthorsWithBookISBN = findAuthorsWithBookISBN