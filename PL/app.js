const db = require("../DAL/database.js")
const validation = require("../BLL/validation.js")
const express = require("express")
const expressHandlebars = require("express-handlebars")

const app = express()

const path = require('path')

// -----------

//Handlebars Setup
app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'layouts')
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

        db.searchBooks(req.query.search).then(books => {
            let foundBooks = []
            for (book of books) {
                foundBooks.push({
                    ISBN: book.get('ISBN'),
                    title: book.get('title'),
                    signID: book.get('signID'),
                    publicationYear: book.get('publicationYear'),
                    publicationInfo: book.get('publicationInfo'),
                    pages: book.get('pages'),
                })
            }
            model = {
                searched: true,
                books: foundBooks,
                currentYear: new Date().getFullYear
            }
            res.render("search-books.hbs", model)
        })

        
    } else {
        res.render("search-books.hbs", model)
    }
})

app.post('/search-books', (req, res) => {
    model = {searched: false}

    

})

app.get('/search-authors', function(req, res) {
    model = {searched: false}

    if (0 < Object.keys(req.query).length) {

        let foundAuthors = []
        db.searchAuthors(req.query.search).then(authors => {
            for (author of authors) {
                foundAuthors.push({
                    id: author.get('id'),
                    name: author.get('firstName') + " " + author.get('lastName'),
                    birthYear: author.get('birthYear')
                })
            }
            console.log("foundauthors: " + JSON.stringify(foundAuthors));
            
            model = {
                searched: true,
                authors: foundAuthors
            }
            res.render("search-authors.hbs", model)
        })
    } else {
        res.render("search-authors.hbs", model)
    }
})

app.get('/search-classifications', (req, res) => {
    model = {
        searched: false,
        classifications: [],
        books: []
    }
    
    db.getClassifications().then(classifications => {
        for (classification of classifications) {
            model.classifications.push({
                signID: classification.get('signID'),
                signum: classification.get('signum'),
                description: classification.get('description')
            })
        }
        
        if (0 < Object.keys(req.query).length) {
            model.searched = true
            const selectedClassification = model.classifications.find(clas => {
                return clas.signum == req.query.classification
            }) 
            
            db.findBooksWithSignID(selectedClassification.signID).then(books => {
                for (book of books) {
                    model.books.push({
                        ISBN: book.get('ISBN'),
                        title: book.get('title'),
                        signID: book.get('signID'),
                        publicationYear: book.get('publicationYear'),
                        publicationInfo: book.get('publicationInfo'),
                        pages: book.get('pages')
                    })
                }
                res.render("search-classifications.hbs", model)
            })
            
        } else {
            res.render("search-classifications.hbs", model)
        }
    })
    
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

app.get('/book/:ISBN', (req, res) => {
    const id = req.params.ISBN
    db.getBook(id).then(book => {
        if (book) {
            db.findAuthorsOfBook(id).then(foundAuthors => { // TODO: denna kod är kopierad och klistrad. Kanske göra funktion? 
                const bookModel = {
                    ISBN: book.get('ISBN'),
                    title: book.get('title'),
                    signID: book.get('signID'),
                    publicationYear: book.get('publicationYear'),
                    publicationInfo: book.get('publicationInfo'),
                    pages: book.get('pages'),
                    authors: foundAuthors
                }
                res.render("book.hbs", bookModel)
            })

        } else {
            console.log("No book");
            //TODO: fix 404 page
            res.render("book.hbs") // langa in model med no book exists?
        }
    })
})

app.get('/edit-book/:ISBN', (req, res) => {

    const isbn = req.params.ISBN
    const book = db.getBook(isbn)

    const model = {
        book: book
    }

    res.render("edit-book.hbs", model)
})

app.get('/author/:id', (req, res) => {
    const id = req.params.id
    db.getAuthor(id).then(author => {
        if (author) {
            db.findBooksFromAuthor(id).then(foundBooks => {
                const authorModel = {
                    id: id,
                    name: author.get('firstName') + " " + author.get('lastName'),
                    birthYear: author.get('birthYear'),
                    books: foundBooks
                }
                console.log("authorModel: " + JSON.stringify(authorModel));
                res.render("author.hbs", authorModel)
            })
        } else {
            console.log("author är null!");
            res.render("author.hbs")
        }
        
        
    })
})

app.get('/edit-author/:id', (req, res) => {
    res.render("edit-author.hbs", db.getAuthor(req.params.id))
})

app.post("/books", (req, res) => {
    const isbn = req.body.ISBN;
    console.log(isbn);
    
})

// ---------------------------------------

app.listen(8080)