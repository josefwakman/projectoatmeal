const express = require("express")
const administratorManager = require("../../BLL/administrator-manager")

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
    model = { privilegies: { 1: "admin", 2: "super admin" } }

    administratorManager.getAdministrators().then(administrators => {
        model.administrators = []
        for (administrator of administrators) {
            model.administrators.push({
                id: administrator.get('id'),
                firstName: administrator.get('firstName'),
                lastName: administrator.get('lastName'),
                email: administrator.get('email'),
                privilegies: administrator.get('privilegies'),
            })
        }
        res.render("administrators.hbs", model)
    })
})



router.get('/:id', (req, res) => {
    administrator = administratorManager.getAdministratorWithId(req.params.id).then(administrator => {
        model = {
            id: administrator.get('id'),
            firstName: administrator.get('firstName'),
            lastName: administrator.get('lastName'),
            email: administrator.get('email'),
            privilegies: administrator.get('privilegies'),
        }
        res.render("administrator.hbs", model)
    })
})

// router.get('/:id', (req, res) => {
//     foundAdmin = administrators.filter((admin) => {
//         return admin.id == req.params.id
//     })
//     res.render("administrator.hbs", foundAdmin[0])
// })

router.post('/', (req, res) => {
    let model = {}
    const body = req.body


    administratorManager.addAdministrator(body, (errors, administrator) => {

        if (0 < errors.length) {
            administratorManager.getAdministrators().then(administrators => {
                model = {
                    errors: errors,
                    postFailed: true,
                    privilegies: { 1: "admin", 2: "super admin" },
                    administrators: []
                }
                for (administrator of administrators) {
                    model.administrators.push({
                        id: administrator.get('id'),
                        firstName: administrator.get('firstName'),
                        lastName: administrator.get('lastName'),
                        email: administrator.get('email'),
                        privilegies: administrator.get('privilegies'),
                    })
                }
                res.render("administrators.hbs", model)
            })
        } else {
            model = {
                firstName: administrator.firstName,
                lastName: administrator.lastName,
                email: administrator.email,
                privilegies: administrator.privilegies
            }
            res.render("administrator.hbs", model)
        }
    })

    // administratorManager.addAdministrator(body).then(administrator => {
    //     model = {
    //         firstName: administrator.firstName,
    //         lastName: administrator.lastName,
    //         email: administrator.email,
    //         privilegies: administrator.privilegies
    //     }
    //     res.render("administrator.hbs", model)
    // }).catch(error => {
    //     model = {}// TODO: add stuff here
    //     res.render("administrators.hbs", model)
    // })

})

router.post('/:id', (req, res) => {
    let newValues = req.body
    newValues.id = req.params.id

    administratorManager.updateAdministrator(newValues, (administrator, errors) => {
        if (errors) {
            model = {
                postFailed: true,
                errors: errors
            }
            res.render("administrator.hbs", model)
        } else {
            res.render("administrator.hbs", administrator)
        }
    })
})

// router.get('/edit/:id', (req, res) => {
//     foundAdmin = administrators.filter((admin) => {
//         return admin.id == req.params.id
//     })
//     res.render("edit-administrator.hbs", foundAdmin[0])
// })

module.exports = router