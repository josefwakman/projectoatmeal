const express = require("express")
const expressHandlebars = require("express-handlebars")

const app = express()

// -----------

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))


// Vi använder routers istället för det här sen va?
// --- GET Requests ----------

app.get('/', function(req, res) { 
    res.render("search-books.hbs")
})

app.get('/search-books', function(req, res) { 
    res.render("search-books.hbs")
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