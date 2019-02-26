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