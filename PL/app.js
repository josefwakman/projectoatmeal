const express = require("express")
const expressHandlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const session = require("express-session")
const connectSqlite3 = require("connect-sqlite3")

const administratorRouter = require("./routers/administrator-router")
const authorRouter = require("./routers/author-router")
const bookRouter = require("./routers/book-router")

const administratorManager = require("../BLL/administrator-manager")
const hashing = require("../BLL/hashing")

const db = require("../DAL/classification-repository")
const dbBooks = require("../DAL/book-repository")

const app = express()
const SQLiteStore = connectSqlite3(session)

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
app.use(session({
    store: new SQLiteStore({ db: "sessions-db.db" }),
    saveUninitialized: false,
    resave: false,
    secret: '2,5dlvatten1dlhavregryn1nypasalt',
    cookie: { maxAge: 60 * 60 * 1000 } // maxAge is in milliseconds, expires after 1 hour
}))

// --------------------

app.get('/', function (req, res) {
    res.render("search-books.hbs")
})

app.get('/test', (req, res) => {
    
    const plaintextpsw = "Pleasehashme"

    let hashedpsw = ""
    hashing.generateHashForPassword(plaintextpsw).then(hash => {
        hashedpsw = hash
        console.log("Hashedpsw:", hashedpsw)

        hashing.compareHashAndPassword("otherpsw", hashedpsw).then(result => {
            console.log("compare otherpsw and hashedpsw", result)
        })

        hashing.compareHashAndPassword(plaintextpsw, hashedpsw).then(result => {
            console.log("compare plaintextpsw and hashedpsw", result)
        })
    })
})

app.post('/test', (req, res) => {
    console.log("Cookies:", req.session.cookie);
    console.log("Session.id:", req.session.id);
    console.log("tjoho:", req.session.tjoho);

    let sess = req.session


    const email = req.body.email
    const password = req.body.password

    administratorManager.getAdministratorWithCredentials(email, password).then(administrator => {
        if (!administrator) {
            const model = {
                loginFailed: true
            }
            sess.tjoho = 123
            req.session.save()
            res.render('test-cookies.hbs', model)
        }
        else {
            const model = {
                loginSucess: true,
                firstName: administrator.get('firstName'),
                lastName: administrator.get('lastName'),
            }
            res.cookie.render('test-cookies.hbs', model)
        }
    }).catch(error => {
        console.log(error)
        // TODO: error page
    })

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
                signId: classification.get('signId'),
                signum: classification.get('signum'),
                description: classification.get('description')
            })
        }

        if (0 < Object.keys(req.query).length) {
            model.searched = true
            const selectedClassification = model.classifications.find(clas => {
                return clas.signum == req.query.classification
            })

            dbBooks.findBooksWithSignId(selectedClassification.signId).then(books => {
                for (book of books) {
                    model.books.push({
                        ISBN: book.get('ISBN'),
                        title: book.get('title'),
                        signId: book.get('signId'),
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
    if (req.session.userId) {
        administratorManager.getAdministratorWithId(req.session.userId).then(administrator => {
            model = {
                loggedIn: true,
                firstName: administrator.get('firstName'),
                lastName: administrator.get('lastName')
            }
            res.render("login.hbs", model)
        }).catch(error => {
            console.log(error)
            model = {
                code: 500,
                message: "Internal server error"
            }
            res.render("error-page.hbs", model)
        })
    } else {
        res.render("login.hbs")
    }

})

app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    administratorManager.getAdministratorWithCredentials(email, password).then(administrator => {
        
        if (!administrator) {
            const model = {
                loginFailed: true,
                previousEmailInput: email
            }
            res.render('login.hbs', model)
        }
        else {
            req.session.userId = administrator.get('id')
            req.session.save()
            const model = {
                loggedIn: true,
                firstName: administrator.get('firstName'),
                lastName: administrator.get('lastName')
            }
            res.render('login.hbs', model)
        }
    }).catch(error => {
        console.log(error)
        model = {
            code: 500,
            message: "Internal server error"
        }
        res.render("error-page.hbs", model)
    })
})

// --------------------------------------

app.use("/administrators", administratorRouter)
app.use("/authors", authorRouter)
app.use("/books", bookRouter)

app.listen(8080)