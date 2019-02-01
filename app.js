const express = require("express")
const expressHandlebars = require("express-handlebars")

const app = express()

const path = require('path')

// -----------

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))

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
        name: "DandyMacBloom"
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
        title: "Harry Potter and the Somewhat Unengaged Chemistry Proffesor",
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

app.use(express.static(path.join(__dirname, '/public')))

// Vi använder routers istället för det här sen va?
// --- GET Requests ----------

app.get('/', function(req, res) { 
    res.render("search-books.hbs")
})

app.get('/search-books', function(req, res) { 
    model = {searched: false}

    if (0 < Object.keys(req.query).length) {

        lowerCaseSearch = req.query.search.toLowerCase()
        const foundBooks = books.filter(function(book) {
            lowerCaseTitle = book.title.toLowerCase()
            return lowerCaseTitle.search(lowerCaseSearch) > -1
        })
        foundTitles = foundBooks.map((book) => book.title)
        
        model = {
            searched: true,
            books: foundBooks
        }
    }

    res.render("search-books.hbs", model)
})

app.get('/search-authors', function(req, res) {
    model = {searched: false}

    if (0 < Object.keys(req.query).length) {

        lowerCaseSearch = req.query.search.toLowerCase()
        const foundAuthors = authors.filter(function(author) {
            lowerCaseAuthor = author.name.toLowerCase()
            return lowerCaseAuthor.search(lowerCaseSearch) > -1
        })
        
        model = {
            searched: true,
            authors: foundAuthors
        }
    }
    res.render("search-authors.hbs", model)
})

app.get('/administrators', function(req, res) {
    model = {
        administrators: administrators
    }
    res.render("administrators.hbs", model)
})

app.get('/administrator/:id', (req, res) => {
    foundAdmin = administrators.filter((admin) => {
            return admin.id == req.params.id
        })
    res.render("administrator.hbs", foundAdmin[0])
})

app.get('/login', function(req, res) {
    res.render("login.hbs")
})

app.get('/book/:id', (req, res) => {
    foundBook = books.filter((book) => {
        return book.id == req.params.id
    })
    res.render("book.hbs", foundBook[0])
})

app.get('/edit-book/:id', (req, res) => {
    foundBook = books.filter((book) => {
        return book.id == req.params.id
    })
    res.render("edit-book.hbs", foundBook[0])
})

app.get('/author/:id', (req, res) => {
    foundAuthor = authors.filter((author) => {
        return author.id == req.params.id
    })
    res.render("author.hbs", foundAuthor[0])
})

app.get('/edit-author/:id', (req, res) => {
    foundAuthor = authors.filter((author) => {
        return author.id == req.params.id
    })
    res.render("edit-author.hbs", foundAuthor[0])
})


// ---------------------------------------

app.listen(8080)