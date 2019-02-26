const express = require("express")
const expressHandlebars = require("express-handlebars")
const bodyParser = require("body-parser")

const administratorRouter = require("./routers/administrator-router")
const authorRouter = require("./routers/author-router")
const bookRouter = require("./routers/book-router")

const db = require("../DAL/classification-repository")
const dbBooks = require("../DAL/book-repository")

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
app.use(bodyParser.urlencoded({ extended: false }))

// Vi använder routers istället för det här sen va?
// --- SEARCH-BOOKS ----------

app.get('/', function (req, res) {
    res.render("search-books.hbs")
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

            dbBooks.findBooksWithSignID(selectedClassification.signID).then(books => {
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



app.get('/login', function (req, res) {
    res.render("login.hbs")
})


// ---------------------------------------

function removeEmptyValues(arr) {
    let newObject = {}
    for (key of Object.keys(arr)) {
        if (!arr[key] == "") {
            newObject[key] = arr[key]
        }
    }
    return newObject
}

// -----------------

app.use("/administrators", administratorRouter)
app.use("/authors", authorRouter)
app.use("/books", bookRouter)

app.listen(8080)