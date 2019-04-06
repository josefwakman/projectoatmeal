const express = require("express")
const classificationManager = require("../../BLL/classification-manager")
const bookManager = require("../../BLL/book-manager")
const pagination = require("../pagination")

const BOOKS_PER_PAGE = 10

const router = express.Router()

router.get('/', (req, res) => {
    let page = req.query.page
    const selectedClassification = req.query.classification

    let model = { searched: false }

    classificationManager.getClassifications().then(foundClassifications => {

        let classifications = []
        for (classification of foundClassifications) {
            classifications.push({
                signId: classification.get('signId'),
                signum: classification.get('signum'),
                description: classification.get('description')
            })
        }
        

        if (0 < Object.keys(req.query).length) {
            model.searched = true

            const classificationWithSignId = classifications.find(clas => {
                return clas.signum == selectedClassification
            })

            bookManager.findBooksWithSignId(classificationWithSignId.signId).then(foundBooks => {
                let books = []
                for (book of foundBooks) {
                    books.push({
                        ISBN: book.get('ISBN'),
                        title: book.get('title'),
                        signId: book.get('signId'),
                        publicationYear: book.get('publicationYear'),
                        publicationInfo: book.get('publicationInfo'),
                        pages: book.get('pages')
                    })
                }
                const amountOfPages = Math.ceil(books.length / BOOKS_PER_PAGE)
                if (page) {
                    const startIndex = (page - 1) * BOOKS_PER_PAGE
                    const endIndex = startIndex + BOOKS_PER_PAGE
                    books = books.slice(startIndex, endIndex)
                } else {
                    page = 1
                    books = books.slice(0, BOOKS_PER_PAGE)
                }

                const paginationWithDots = pagination.getPaginationWithDots(parseInt(page), amountOfPages)
                model.paginationWithDots = paginationWithDots
                model.classifications = classifications
                model.classification = selectedClassification
                model.books = books
                model.page = page

                res.render("search-classifications.hbs", model)
            })

        } else {
            model.classifications = classifications
            res.render("search-classifications.hbs", model)
        }
    }).catch(error => {
        console.log(error)
        model = {
            code: 500,
            message: "Internal server error"
        }
    })

})

module.exports = router