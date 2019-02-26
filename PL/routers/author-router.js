const express = require("express")
const db = require("../../DAL/database.js")
const validation = require("../../BLL/validation.js")
const expressHandlebars = require("express-handlebars")
const bodyParser = require("body-parser")

const router = express.Router()


// ----- SEARCH-AUTHORS

router.get('/search', function (req, res) {
    model = { searched: false }

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

router.post('/', (req, res) => {
    let model = {searched: false}
    
    const errors = validation.validateAuthor(req.body)

    if (0 < errors.length) {
        model.errors = errors
        model.postError = true
        res.render("search-authors.hbs", model)
    } else {
        db.addAuthor({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthYear: req.body.birthYear
        }).then(author => {
            if (author) {
                db.findBooksFromAuthor(author.id).then(foundBooks => {
                    const model = {
                        id: author.get('id'),
                        name: author.get('firstName') + " " + author.get('lastName'),
                        birthYear: author.get('birthYear'),
                        books: foundBooks
                    }
                    res.render("author.hbs", model)
                })
            } else {

                model = {addAuthorFailute: true}
                res.render("author.hbs", model)
            }
        })
    }
})

router.get('/:id', (req, res) => {
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






router.get('/edit/:id', (req, res) => {
    res.render("edit-author.hbs", db.getAuthor(req.params.id))
})

router.post('/edit', (req, res) => {
    const body = removeEmptyValues(req.body)
    const errors = validation.validateBook(body)

    if (0 < Object.keys(errors)) {
        model = {
            failedValidation: true,
            errors: errors
        }
        res.render('edit-author.hbs', model)
    } else {
        db.editAuthor(body)
        res.render("edit-author.hbs")
    }
})

module.exports = router