const authorRepository = require('../DAL/author-repository')
const validator = require('./validation')

function findAuthorsWithName(string) {
    authorRepository.findAuthorsWithName(string, (foundAuthors, error) => {
        if (error) {
            callback([], error)
        } else {
            callback(foundAuthors)
        }
    })
}