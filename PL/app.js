const express = require("express")
const expressHandlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")

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
app.use(cookieParser())


// --------------------

app.get('/', function (req, res) {
    res.render("search-books.hbs")
})

app.get('/test', (req, res) => {
    console.log(req.cookies);
    
    let model = {}
    if (req.cookies.beenherebefore) {
        model = {
            yesCookie: true
        }
    } else {
        model = {
            noCookie: true
        }
        res.cookie("beenherebefore", true)
    }

    res.render("test-cookies.hbs", model)
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
    let model = {}

    const username = req.query.username
    const password = req.query.password

    if (!(password || username)) {
        model = {
            noCredentials: true
        }
    } else {
        
    }

    res.render("login.hbs", model)
})

// --------------------------------------

app.use("/administrators", administratorRouter)
app.use("/authors", authorRouter)
app.use("/books", bookRouter)

app.listen(8080)