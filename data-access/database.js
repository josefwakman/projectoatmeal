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

const Authors = sequelize.define("Author", {
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

const BookAuthor = sequelize.define("BookAuthors", {
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
    }
]

books = [
    {
        id: 0,
        title: "Yo",
        author: "Mr. X"
    },
    {
        id: 1,
        title: "Woop Woop",
        author: "Mr. X"
    },
    {
        id: 3,
        title: "Harry Potter and the Somewhat Unengaged Chemistry Professor",
        author: "Dandy MacBloom"
    },
    {
        id: 4,
        title: "A Night at the Chicago opera House",
        author: "Andy Beepmaster"
    },
    {
        id: 5,
        title: "Harry Potter and Another Test Title",
        author: "DandyMacBloom"
    },
    {
        id: 6,
        title: "Du bist eine Kartoffel, Harry",
        author: "M. Bartoscheck"
    }
]

// -----------------

function searchBooks(query) {
    lowerCaseSearch = query.toLowerCase()
        const foundBooks = books.filter(function(book) {
            lowerCaseTitle = book.title.toLowerCase()
            return lowerCaseTitle.search(lowerCaseSearch) > -1
        })
    return foundBooks
}

function searchAuthors(query) {
    lowerCaseSearch = query.toLowerCase()
        const foundAuthors = authors.filter(function(author) {
            lowerCaseAuthor = author.name.toLowerCase()
            return lowerCaseAuthor.search(lowerCaseSearch) > -1
        })
    return foundAuthors
}



// ---- EXPORTS ---------

exports.searchBooks = searchBooks
exports.searchAuthors = searchAuthors