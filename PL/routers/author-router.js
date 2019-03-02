const express = require("express")
const authorRepository = require("../../DAL/author-repository")
const validation = require("../../BLL/validation.js")

const router = express.Router()


// ----- SEARCH-AUTHORS

router.get('/search', function (req, res) {
    model = { searched: false }

    if (0 < Object.keys(req.query).length) {

        authorRepository.findAuthorsWithName(req.params.search, (foundAuthors, error) => {
            if (error) {
                // TODO: error handling
            } else {
                let authors = []
                for (author of foundAuthors) {
                    authors.push({
                        id: author.get('id'),
                        firstName: author.get('firstName'),
                        lastName: author.get('lastName'),
                        birthYear: author.get('birthYear')
                    })
                }
                model = {
                    searched: true,
                    authors: authors
                }
                res.render("search-authors.hbs", model)
            }
        })

        // let foundAuthors = []
        // dbAuthors.searchAuthors(req.query.search).then(authors => {
        //     for (author of authors) {
        //         foundAuthors.push({
        //             id: author.get('id'),
        //             name: author.get('firstName') + " " + author.get('lastName'),
        //             birthYear: author.get('birthYear')
        //         })
        //     }

        //     model = {
        //         searched: true,
        //         authors: foundAuthors
        //     }
        //     res.render("search-authors.hbs", model)
        // })
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
        dbAuthors.addAuthor({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthYear: req.body.birthYear
        }).then(author => {
            if (author) {
                dbAuthors.findBooksFromAuthor(author.id).then(foundBooks => {
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
    dbAuthors.getAuthor(id).then(author => {
        if (author) {
            dbAuthors.findBooksFromAuthor(id).then(foundBooks => {
                const authorModel = {
                    id: id,
                    name: author.get('firstName') + " " + author.get('lastName'),
                    birthYear: author.get('birthYear'),
                    books: foundBooks
                }
                res.render("author.hbs", authorModel)
            })
        } else {
            console.log("author är null!");
            res.render("author.hbs")
        }


    })
})






router.get('/edit/:id', (req, res) => {
    res.render("edit-author.hbs", dbAuthors.getAuthor(req.params.id))
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
        dbAuthors.editAuthor(body)
        res.render("edit-author.hbs")
    }
})

module.exports = router