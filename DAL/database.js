//Handle database connection
const mysql = require("mysql")
const Sequelize = require("sequelize")
const sequelize = new Sequelize("Library", "ster1666", "gustaferik", {
    host: "cloudservices.cxfts5ufu8vm.eu-west-2.rds.amazonaws.com",
    dialect: "mysql",
    define: {
        timestamps: false
    }
})

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection established");
    })
    .catch(err => {
        console.error("Connection failed", err)
    })

const Op = Sequelize.Op

//Sequelize database models
const Authors = sequelize.define("Authors", {

    // !!! fungerar det att skriva firstname: Sequelize.STRING istället? 

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    birthYear: {
        type: Sequelize.STRING,
        validate: { min: 0, max: new Date().getFullYear }
    }
})

const BookAuthors = sequelize.define("BookAuthors", {
    bookISBN: {
        type: Sequelize.STRING,
        references: {
            model: "Books",
            key: "ISBN"
        }
    },
    authorID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: "Authors",
            key: "id"
        }
    }
})

const Classifications = sequelize.define("Classifications", {
    signID: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    signum: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
})

const Books = sequelize.define("Books", {
    ISBN: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    signID: {
        type: Sequelize.INTEGER
    },
    publicationYear: {
        type: Sequelize.STRING,
        validate: { min: 0, max: new Date().getFullYear }
    },
    publicationInfo: {
        type: Sequelize.STRING
    },
    pages: {
        type: Sequelize.SMALLINT,
        validate: { min: 1 }
    }
})

const Administrators = sequelize.define("Administrators", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    privilegies: {
        type: Sequelize.INTEGER
    }
})

// ---- PLACEHOLDERS - TO BE DELETED ----------------

administrators = [
    {
        id: 1776,
        name: "Thomas Jefferson",
        privilegies: "admin",
        email: "tea_party_lover@us.gov",
    },
    {
        id: 1789,
        name: "Marquis de Lafayette",
        privilegies: "admin",
        email: "fuckyourobespierre@merde.fr",
    },
    {
        id: 1812,
        name: "Simon Bolivar",
        privilegies: "superadmin",
        email: "1r0n4$$@sandomingoisnicethistimeofyear.vz",
    }
]

// -----------------

function getAuthor(id) {
    return Authors.findOne({ where: { id: id } }).then(author => {
        return author
    })
}

function getBook(ISBN) {
    return Books.findOne({ where: { ISBN: ISBN } }).then(book => {
        return book
    })
}

function getClassifications() {
    return Classifications.findAll()
}

function findBooksWithSignID(signID) {
    return Books.findAll({
        where: { signID: signID }
    })
}


function findAuthorsOfBook(ISBN) { // returns array of authors belonging to book, even if just one

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

function findBooksFromAuthor(authorID) {

    return BookAuthors.findAll({
        where: { authorID: authorID }
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
            let booksModel = []
            for (book of books) {
                booksModel.push({
                    ISBN: book.get('ISBN'),
                    title: book.get('title'),
                    signID: book.get('signID'),
                    publicationYear: book.get('publicationYear'),
                    publicationInfo: book.get('publicationInfo'),
                    pages: book.get('pages')
                })
            }
            return booksModel
        })
    })
}


function searchBooks(query) {
    return Books.findAll({
        // TODO: lägg till limit: (nummer)?
        where: { title: { [Op.like]: "%" + query + "%" } }
    }).then(foundBooks => {
        return foundBooks
    })
}

function searchAuthors(query) {

    return Authors.findAll({
        // TODO: lägg till limit: (nummer)?
        where: {
            [Op.or]: [
                { firstName: { [Op.like]: "%" + query + "%" } },
                { lastName: { [Op.like]: "%" + query + "%" } }
            ]
        }
    }).then(foundAuthors => {
        return foundAuthors
    })
}



// ------- CREATE ----

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
    })
}

function addAuthor(author) {
    return Authors.create({
        firstName: author.firstName,
        lastName: author.lastName,
        birthYear: author.birthYear
    }).then(author => {
        return author
    })
}

function addAdministrator(administrator) {
    return Administrators.create({
        firstName: administrator.firstName,
        lastName: administrator.lastName,
        email: administrator.email,
        privilegies: administrator.privilegies
    }).then(administrator => {
        return administrator
    }).catch(err => {
        console.error(err);
    })
}





// ---- EDIT ---- 

function editBook(newValues) {

    Books.findOne({
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
        foundBook.save().then(() => {
            // Kanske skicka användaren till uppdaterade boken? Då ska vi returna boken
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




// ---- EXPORTS ---------

exports.getAuthor = getAuthor
exports.getBook = getBook
exports.getClassifications = getClassifications

exports.findBooksWithSignID = findBooksWithSignID
exports.findBooksFromAuthor = findBooksFromAuthor
exports.findAuthorsOfBook = findAuthorsOfBook

exports.searchBooks = searchBooks
exports.searchAuthors = searchAuthors

exports.addBook = addBook
exports.addAuthor = addAuthor

exports.editBook = editBook
exports.editAuthor = editAuthor

exports.addAdministrator = addAdministrator