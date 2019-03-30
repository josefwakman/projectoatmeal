const express = require("express")
const administratorManager = require("../../BLL/administrator-manager")
const authorization = require("../../BLL/authorization")

const router = express.Router()

function deleteButtonPressed() {
    if (confirm("Do you really want to delete this user?")) {
        console.log("Radera jäveln");
        
    } else {
        console.log("Ok, inte");
        
    }
}

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
    model = { privilegies: { 1: "admin", 2: "super admin", 3: "admin supreme" } }  // TODO: replace with global variable (from validation?)

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
    }).catch(error => {
        console.log(error)
        model = {
            code: 500,
            message: "Internal server error"
        }
        res.render("error-page.hbs", model)
    })
})



router.get('/:id', (req, res) => {
    const userId = req.session.userId

    administrator = administratorManager.getAdministratorWithId(req.params.id).then(administrator => {
        let model = {
            id: administrator.get('id'),
            firstName: administrator.get('firstName'),
            lastName: administrator.get('lastName'),
            email: administrator.get('email'),
            privilegies: administrator.get('privilegies'),
        }
        if (userId) {
            authorization.getAccessLevelOfAdministratorId(userId).then(accesslevel => {

                for (let i = 1; i <= accesslevel; i++) {
                    model[authorization.accessLevels[i]] = true
                }
                res.render("administrator.hbs", model)
            }).catch(error => {
                console.log(error)
                model = {
                    code: 500,
                    message: "Internal server error"
                }
                res.render("error-page.hbs", model)
            })
        } else {
            res.render("administrator.hbs", model)
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

router.post('/', (req, res) => {
    let model = {}
    const body = req.body


    administratorManager.addAdministrator(body, (validationErrors, serverError, administrator) => {

        if (0 < validationErrors.length) {
            administratorManager.getAdministrators().then(administrators => {
                model = {
                    errors: errors,
                    validationError: true,
                    privilegies: { // TODO: replace with global variable (from validation?)
                        1: "admin",
                        2: "super admin",
                        3: "admin supreme"
                    },
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
        } else if (serverError) {
            model = {
                code: 500,
                message: "Internal server error"
            }
            res.render("error-page.hbs", model)
        }
        else {
            model = {
                firstName: administrator.firstName,
                lastName: administrator.lastName,
                email: administrator.email,
                privilegies: administrator.privilegies
            }
            res.render("administrator.hbs", model)
        }
    })
})

router.get('/edit/:id', (req, res) => {
    const userId = req.session.userId

    if (!userId) {
        model = {
            code: 403,
            message: "You need to be logged in as administrator to edit administrators"
        }
        res.render("error-page.hbs", model)
    }
    else {
        administratorManager.getAdministratorWithId(req.params.id).then(administrator => {
            model = {
                id: administrator.id,
                firstName: administrator.firstName,
                lastName: administrator.lastName,
                email: administrator.email,
                privilegies: administrator.privilegies
            }
    
            authorization.getAccessLevelOfAdministratorId(userId).then(accesslevel => {
    
                for (let i = 1; i <= accesslevel; i++) {
                    model[authorization.accessLevels[i]] = true
                }
                res.render("edit-administrator.hbs", model)
    
            })
    
        }).catch(error => {
            console.log(error)
            model = {
                code: 500,
                message: "Internal server error"
            }
            res.render("error-page.hbs", model)
        })
    }
})

router.post('/edit/:id', (req, res) => {
    let newValues = req.body
    newValues.id = req.params.id

    administratorManager.updateAdministrator(newValues, (validationErrors, serverError, administrator) => {
        if (validationErrors.length) {
            model = {
                validationError: true,
                errors: errors
            }
            res.render("edit-administrator.hbs", model)
        } else if (serverError) {

            model = {
                code: 500,
                message: "Internal server error"
            }
            res.render("error-page.hbs", model)

        }
        else {
            model = {
                id: administrator.get('id'),
                firstName: administrator.get('firstName'),
                lastName: administrator.get('lastName'),
                email: administrator.get('email'),
                privilegies: administrator.get('privilegies')
            }

            res.render("administrator.hbs", model)
        }
    })
})

module.exports = router