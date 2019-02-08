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
const Authors = sequelize.define("Author", {

    // !!! fungerar det att skriva firstname: Sequelize.STRING istället? 

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    birthYear: {
        type: Sequelize.STRING
    }
})

const BookAuthors = sequelize.define("BookAuthors", {
    bookISBN: {
        type: Sequelize.STRING
    },
    authorID: {
        type: Sequelize.INTEGER,
        primaryKey: true
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
        type: Sequelize.STRING
    },
    publicationInfo: {
        type: Sequelize.STRING
    },
    pages: {
        type: Sequelize.SMALLINT
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

authors = [
    {
        id: 0,
        name: "Dandy MacBloom"
    },
    {
        id: 1,
        name: "Andy Beepmaster"
    },
    {
        id: 2,
        name: "Anders von Beetow"
    },
    {
        id: 3,
        name: "M. Bartoscheck"
    },
    {
        id: 4,
        name: "J. von Anka"
    },
    {
        id: 5,
        name: "John McLane"
    },
    {
        id: 6,
        name: "Mr .X"
    }
]

books = [
    {
        id: 0,
        title: "Yo",
        ISBN: 1
    },
    {
        id: 1,
        title: "Woop Woop",
        ISBN: 2
    },
    {
        id: 3,
        title: "Harry Potter and the Somewhat Unengaged Chemistry Professor",
        ISBN: 3
    },
    {
        id: 4,
        title: "A Night at the Chicago opera House",
        ISBN: 4
    },
    {
        id: 5,
        title: "Harry Potter and Another Test Title",
        ISBN: 5
    },
    {
        id: 6,
        title: "Du bist eine Kartoffel, Harry",
        ISBN: 6
    }
]

bookAuthors = [
    {
        ISBN: 1,
        authorID: 1
    },
    {
        ISBN: 2,
        authorID: 1
    },
    {
        ISBN: 2,
        authorID: 2
    },
    {
        ISBN: 3,
        authorID: 4
    },
    {
        ISBN: 4,
        authorID: 5
    },
    {
        ISBN: 5,
        authorID: 6
    },
    {
        ISBN: 6,
        authorID: 1
    },
    {
        ISBN: 6,
        authorID: 3
    },
]

// -----------------

function getAuthor(id) {
    return Authors.findOne({where: {id: id}}).then(author => {
        return author
    })
}

function getBook(ISBN) {
    return Books.findOne({where: {ISBN: ISBN}}).then(book => {
        return book
    })
}


function findAuthorsOfBook(ISBN) { // returns array of authors belonging to book, even if just one

    return BookAuthors.findAll({
        where: {bookISBN: ISBN}
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
        where: { authorID: authorID}
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
        where: { title: { [Op.like]: "%" + query + "%"} }
    }).then(foundBooks => {
         return foundBooks
    })
}

function searchAuthors(query) {

   return Authors.findAll({
       // TODO: lägg till limit: (nummer)?
       where: {
           [Op.or]: [
               {firstName: {[Op.like]: "%" + query + "%"} },
               {lastName: {[Op.like]: "%" + query + "%"} }
           ] 
       }
   }).then(foundAuthors => {
        return foundAuthors
   })
}



// ---- EXPORTS ---------

exports.getAuthor = getAuthor
exports.getBook = getBook

exports.findBooksFromAuthor = findBooksFromAuthor
exports.findAuthorsOfBook = findAuthorsOfBook

exports.searchBooks = searchBooks
exports.searchAuthors = searchAuthors