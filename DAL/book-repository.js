const {Books, BookAuthors, Op} = require("./models")


function findBooksWithTitle(query) {
    return Books.findAll({
        // TODO: lägg till limit: (nummer)? Så vi inte får för många böcker tillbaka
        where: { title: { [Op.like]: "%" + query + "%" } }
    }).then(foundBooks => {
        return foundBooks
    })
}

function findBookWithISBN(ISBN) {
    return Books.findOne({ where: { ISBN: ISBN } }).then(book => {
        return book
    }).catch(error => {
        throw error
    })
}

function findBooksWithAuthorId(id) {

    return BookAuthors.findAll({
        where: { authorID: id }
    }).then(bookAuthors => {
        let foundBooks = []
        for (bookAuthor of bookAuthors) {
            foundBooks.push({
                ISBN: bookAuthor.bookISBN
            })
        }

        return Books.findAll({
            where: {
                [Op.or]: foundBooks
            }
        }).then(books => {
            return books
        }).catch(error => {
            throw error
        })
    }).catch(error => {
        throw error 
    })
}


function addBook(book) {
    return Books.create({
        ISBN: book.ISBN,
        title: book.title,
        signID: book.signID,
        publicationYear: book.publicationYear,
        publicationInfo: book.publicationInfo,
        pages: book.pages
    }).then(book => {
        return book
    }).catch(error => {
        throw error
    })
}

function editBook(newValues) {

    return Books.findOne({
        where: { ISBN: newValues.ISBN }
    }).then(foundBook => {
        for (key of Object.keys(newValues)) { // TODO: detta är lite fult. Kanske kan vi skicka in en array rensad från tomma fällt?
            switch (key) {
                case "title":
                    foundBook.title = newValues.title
                    break
                case "signID":
                    foundBook.signID = newValues.signID
                    break
                case "publicationInfo":
                    foundBook.publicationInfo = newValues.publicationInfo
                    break
                case "publicationYear":
                    foundBook.publicationYear = newValues.publicationYear
                    break
                case "pages":
                    foundBook.pages = newValues.pages
                    break
            }
        }
        return foundBook.save()
    }).catch(error => {
        throw error
    })
}

function findBooksWithSignId(signId) {
    return Books.findAll({
        where: { signID: signId }
    })
}

// ------------ Exports -----------------

exports.findBookWithISBN = findBookWithISBN
exports.findBooksWithSignId = findBooksWithSignId
exports.findBooksWithAuthorId = findBooksWithAuthorId
exports.findBooksWithTitle = findBooksWithTitle
exports.addBook = addBook
exports.editBook = editBook