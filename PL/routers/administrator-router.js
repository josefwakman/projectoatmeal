const express = require("express")
const db = require("../../DAL/database.js")
const validation = require("../../BLL/validation.js")
const expressHandlebars = require("express-handlebars")
const bodyParser = require("body-parser")

const router = express.Router()

router.get('/', function (req, res) {
    model = {
        administrators: administrators,
        privilegies: { 1:"admin", 2:"super admin"}
    }
    res.render("administrators.hbs", model)
})



router.get('/:id', (req, res) => {
    foundAdmin = administrators.filter((admin) => {
        return admin.id == req.params.id
    })
    res.render("administrator.hbs", foundAdmin[0])
})

router.post('/', (req, res) => {
    let model = {}

    const body = req.body
    const errors = validation.validateAdministrator(body)
    console.log("Body: " + JSON.stringify(body));
    

    if (0 < Object.keys(errors).length) {
        console.log("Errors: " + JSON.stringify(errors));
        
        model.errors = errors
        model.postError = true
        res.render("administrator.hbs", model)
    } else {
        console.log("Adding administrator");
        db.addAdministrator(body).then(administrator => {
            model = {
                firstName: administrator.firstName,
                lastName: administrator.lastName,
                email: administrator.email,
                privilegies: administrator.privilegies
            }
            res.render("administrator.hbs", model)
        })
        
    }
})

router.get('/edit/:id', (req, res) => {
    foundAdmin = administrators.filter((admin) => {
        return admin.id == req.params.id
    })
    res.render("edit-administrator.hbs", foundAdmin[0])
})

module.exports = router