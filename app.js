const express = require("express")
const expressHandlebars = require("express-handlebars")

const app = express()

// -----------

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))

// ---- PLACEHOLDERS - TO BE DELETED ----------------



books = [
    {
        title: "Yo",
        author: "Mr. X"
    },
    {
        title: "Woop Woop",
        author: "Mr. X"
    },
    {
        title: "Harry Potter and the Somewhat Unengaged Chemistry Proffesor",
        author: "Dandy MacBloom"
    },
    {
        title: "A Night at the Chicago opera House",
        author: "Andy Beepmaster"
    },
    {
        title: "Harry Potter and Another Test Title",
        author: "DandyMacBloom"
    },
    {
        title: "Du bist eine Kartoffel, Harry",
        author: "M. Bartoscheck"
    }
]

bookTitles = [
    "Yo", 
    "Woop Woop",
    "Harry Potter and the Somewhat Unengaged Chemistry Proffesor",
    "A Night at the Chicago opera House",
    "Harry Potter and Another Test Title",
    "Du bist eine Kartoffel, Harry",
]


// Vi använder routers istället för det här sen va?
// --- GET Requests ----------

app.get('/', function(req, res) { 
    res.render("search-books.hbs")
})

app.get('/search-books', function(req, res) { 
    model = {searched: false}

    if (0 < Object.keys(req.query).length) {

        lowerCaseSearch = req.query.search.toLowerCase()
        const foundBooks = bookTitles.filter(function(str) {
            lowerCaseStr = str.toLowerCase()
            return lowerCaseStr.search(lowerCaseSearch) > -1
        })

        model = {
            searched: true,
            books: foundBooks
        }
    }

    res.render("search-books.hbs", model)
})

app.get('/search-authors', function(req, res) {
    res.render("search-authors.hbs")
})

app.get('/administrators', function(req, res) {
    res.render("administrators.hbs")
})

app.get('/login', function(req, res) {
    res.render("login.hbs")
})



app.listen(8080)