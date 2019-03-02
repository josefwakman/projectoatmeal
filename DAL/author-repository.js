const {Authors, BookAuthors, Op} = require("./models")

function findAuthorsWithName(string) {
    return Authors.findAll({
        // TODO: lägg till limit: (nummer)?
        where: {
            [Op.or]: [
                { firstName: { [Op.like]: "%" + string + "%" } },
                { lastName: { [Op.like]: "%" + string + "%" } }
            ]
        }
    }).then(foundAuthors => {
        return foundAuthors
    }).catch(error => {
        throw error
    })
}

function getAuthorWithId(id) {
    return Authors.findOne({ where: { id: id } }).then(author => {
        return author
    }).catch(error => {
        throw error
    })
}

function addAuthor(author) {
    return Authors.create({
        firstName: author.firstName,
        lastName: author.lastName,
        birthYear: author.birthYear
    }).then(author => {
        return author
    }).catch(error => {
        throw error
    })
}

function findAuthorsWithBookISBN(ISBN) { // returns array of authors belonging to book, even if just one

    return BookAuthors.findAll({
        where: { bookISBN: ISBN }
    }).then(bookAuthors => {
        let foundAuthors = []
        for (bookAuthor of bookAuthors) {
            foundAuthors.push({
                id: bookAuthor.get('authorID')
            })
        }

        return Authors.findAll({
            where: {
                [Op.or]: foundAuthors
            }
        }).then(authors => {
            let authorModel = []
            for (author of authors) {
                authorModel.push({
                    id: author.get('id'),
                    name: author.get('firstName') + " " + author.get('lastName'),
                    birthYear: author.get('birthYear')
                })
            }
            return authorModel
        })
    })
}

function editAuthor(newValues) {
    Authors.findOne({
        where: { id: newValues.id }
    }).then(foundAuthor => {
        for (key of Object.keys(newValues)) {
            switch (key) {
                case "id":
                    foundAuthor.id = newValues.id
                    break
                case "firstName":
                    foundAuthor.firstName = newValues.firstName
                    break
                case "lastName":
                    foundAuthor.lastName = newValues.lastName
                    break
                case "birthYear":
                    foundAuthor.birthYear = newValues.birthYear
            }
        }
        foundAuthor.save().then(() => {
            // TODO: kanske skicka användaren till uppdaterade författaren?
        })
    })
}

// ----- Exports --------------

exports.findAuthorsWithName = findAuthorsWithName
exports.getAuthorWithId = getAuthorWithId
exports.findAuthorsWithBookISBN = findAuthorsWithBookISBN

exports.addAuthor = addAuthor
exports.editAuthor = editAuthor