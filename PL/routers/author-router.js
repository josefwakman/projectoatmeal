const express = require("express")
const authorManager = require("../../BLL/author-manager")

const router = express.Router()


// ----- SEARCH-AUTHORS

router.get('/search', function (req, res) {
    model = { searched: false }

    if (0 < Object.keys(req.query).length) {

        authorManager.findAuthorsWithName(req.params.search, (foundAuthors, error) => {
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
    } else {
        res.render("search-authors.hbs", model)
    }
})

router.get('/:id', (req, res) => {
    
    const id = req.params.id
    authorManager.getAuthorWithId(id, (author, error) => {
        if (error) {
            model = {
                getFailed: true,
                error: error
            }
            res.render("author.hbs", model)
        } else {
            // TODO: hämta böcker 
            res.render("author.hbs", author)
        }
    })
    
    // const id = req.params.id
    // dbAuthors.getAuthor(id).then(author => {
    //     if (author) {
    //         dbAuthors.findBooksFromAuthor(id).then(foundBooks => {
    //             const authorModel = {
    //                 id: id,
    //                 name: author.get('firstName') + " " + author.get('lastName'),
    //                 birthYear: author.get('birthYear'),
    //                 books: foundBooks
    //             }
    //             res.render("author.hbs", authorModel)
    //         })
    //     } else {
    //         console.log("author är null!");
    //         res.render("author.hbs")
    //     }
    // })
})

router.post('/', (req, res) => {
    let model = {searched: false}

    authorManager.addAuthor(req.body, (author, errors) => {
        if (errors) {
            model = {
                postFailed: true,
                errors: errors
            }
            res.render("search-authors.hbs", model)
        } else {
            res.render("author.hbs", author)
        }
    })
    
    // const errors = validation.validateAuthor(req.body)

    // if (0 < errors.length) {
    //     model.errors = errors
    //     model.postError = true
    //     res.render("search-authors.hbs", model)
    // } else {
    //     dbAuthors.addAuthor({
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         birthYear: req.body.birthYear
    //     }).then(author => {
    //         if (author) {
    //             dbAuthors.findBooksFromAuthor(author.id).then(foundBooks => {
    //                 const model = {
    //                     id: author.get('id'),
    //                     name: author.get('firstName') + " " + author.get('lastName'),
    //                     birthYear: author.get('birthYear'),
    //                     books: foundBooks
    //                 }
    //                 res.render("author.hbs", model)
    //             })
    //         } else {

    //             model = {addAuthorFailute: true}
    //             res.render("author.hbs", model)
    //         }
    //     })
    // }
})

router.post('/edit/id', (req, res) => {

    let newValues = req.body
    newValues.id = req.params.id

    authorManager.editAuthor(newValues, (author, error) => {
        if (error) {
            // TODO: error handling
        } else {
            // TODO: hämta böcker
            res.render('author.hbs', author)
        }
    })

    // const body = removeEmptyValues(req.body)
    // const errors = validation.validateBook(body)

    // if (0 < Object.keys(errors)) {
    //     model = {
    //         failedValidation: true,
    //         errors: errors
    //     }
    //     res.render('edit-author.hbs', model)
    // } else {
    //     dbAuthors.editAuthor(body)
    //     res.render("edit-author.hbs")
    // }
})

router.get('/edit/:id', (req, res) => {
    
    const id = req.params.id
    res.render("edit-author.hbs", id)
})

module.exports = router