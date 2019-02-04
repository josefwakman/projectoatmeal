const db = require("./data-access/database.js")
const express = require("express")
const expressHandlebars = require("express-handlebars")

const app = express()

const path = require('path')
//Events
const events = require('events')
const eventEmitter = new events.EventEmitter();

// -----------

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.use(express.static(path.join(__dirname, '/public')))

// Vi använder routers istället för det här sen va?
// --- GET Requests ----------

app.get('/', function(req, res) { 
    res.render("search-books.hbs")
})

app.get('/search-books', function(req, res) { 
    model = {searched: false}

    if (0 < Object.keys(req.query).length) {

        const foundBooks = db.searchBooks(req.query.search)

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

        const foundAuthors = db.searchAuthors(req.query.search)
        
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
    console.log(administrators);
    
    res.render("administrators.hbs", model)
})

app.get('/administrator/:id', (req, res) => {
    foundAdmin = administrators.filter((admin) => {
            return admin.id == req.params.id
        })
    res.render("administrator.hbs", foundAdmin[0])
})

app.get('/edit-administrator/:id', (req, res) => {
    foundAdmin = administrators.filter((admin) => {
            return admin.id == req.params.id
        })
    res.render("edit-administrator.hbs", foundAdmin[0])
})

app.get('/login', function(req, res) {
    res.render("login.hbs")
})

app.get('/book/:id', (req, res) => {
    res.render("book.hbs", db.getBook(req.params.id))
})

app.get('/edit-book/:id', (req, res) => {
    res.render("edit-book.hbs", db.getBook(req.params.id))
})

app.get('/author/:id', (req, res) => {
    res.render("author.hbs", db.getAuthor(req.params.id))
})

app.get('/edit-author/:id', (req, res) => {
    res.render("edit-author.hbs", db.getAuthor(req.params.id))
})


// ---------------------------------------

app.listen(8080)