const {Authors, BookAuthors, Op} = require("./models")

function findAuthorsWithName(string) {
    return Authors.findAll({
        where: {
            [Op.or]: [
                { firstName: { [Op.like]: "%" + string + "%" } },
                { lastName: { [Op.like]: "%" + string + "%" } }
            ]
        }
    })
}

function getAuthorWithId(id) {
    return Authors.findOne({ 
        where: { id: id } 
    })
}

function addAuthor(author) {
    if (author.birthYear == "") {
        author.birthYear = null
    }
    return Authors.create({
        firstName: author.firstName,
        lastName: author.lastName,
        birthYear: author.birthYear
    }).then(author => {
        return author
    })
}

function editAuthor(newValues) {
    return Authors.findOne({
        where: { id: newValues.id }
    }).then(foundAuthor => {
        for (key of Object.keys(newValues)) {
            switch (key) {
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
        return foundAuthor.save()
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
        })
    })
}

// ----- Exports --------------

exports.findAuthorsWithName = findAuthorsWithName
exports.getAuthorWithId = getAuthorWithId
exports.findAuthorsWithBookISBN = findAuthorsWithBookISBN

exports.addAuthor = addAuthor
exports.editAuthor = editAuthor