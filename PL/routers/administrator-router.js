const express = require("express")
const administratorManager = require("../../BLL/administrator-manager")
const validation = require("../../BLL/validation.js")

const router = express.Router()

// ---- PLACEHOLDERS - TO BE DELETED ----------------

administrators = [
    {
        id: 1776,
        name: "Thomas Jefferson",
        privilegies: "admin",
        email: "tea_party_lover@us.gov",
    },
    {
        id: 1789,
        name: "Marquis de Lafayette",
        privilegies: "admin",
        email: "fuckyourobespierre@merde.fr",
    },
    {
        id: 1812,
        name: "Simon Bolivar",
        privilegies: "superadmin",
        email: "1r0n4$$@sandomingoisnicethistimeofyear.vz",
    }
]

// ---------------------------------------------------------------------


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

    administratorManager.addAdministrator(body).then(administrator => {
        model = {
            firstName: administrator.firstName,
            lastName: administrator.lastName,
            email: administrator.email,
            privilegies: administrator.privilegies
        }
        res.render("administrator.hbs", model)
    }).catch(error => {
        model = {}// TODO: add stuff here
        res.render("administrators.hbs", model)
    })

})

router.get('/edit/:id', (req, res) => {
    foundAdmin = administrators.filter((admin) => {
        return admin.id == req.params.id
    })
    res.render("edit-administrator.hbs", foundAdmin[0])
})

module.exports = router