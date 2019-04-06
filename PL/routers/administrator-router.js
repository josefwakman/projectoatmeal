const express = require("express")
const administratorManager = require("../../BLL/administrator-manager")
const authorization = require("../../BLL/authorization")

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
    let model = { accessLevels: authorization.accessLevels } 

    administratorManager.getAdministrators().then(administrators => {
        model.administrators = []
        for (administrator of administrators) {
            model.administrators.push({
                id: administrator.get('id'),
                firstName: administrator.get('firstName'),
                lastName: administrator.get('lastName'),
                email: administrator.get('email'),
                accesslevel: administrator.get('accesslevel'),
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
            accessLevel: authorization.accessLevels[administrator.get('accessLevel')],
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
    const userId = req.session.userId

    administratorManager.addAdministrator(body, userId, (validationErrors, error, administrator) => {

        if (0 < validationErrors.length) {
            administratorManager.getAdministrators().then(administrators => {
                model = {
                    errors: validationErrors,
                    validationError: true,
                    accessLevels: authorization.accessLevels,
                    administrators: []
                }
                for (administrator of administrators) {
                    model.administrators.push({
                        id: administrator.get('id'),
                        firstName: administrator.get('firstName'),
                        lastName: administrator.get('lastName'),
                        email: administrator.get('email'),
                        accesslevel: administrator.get('accesslevel'),
                    })
                }
                res.render("administrators.hbs", model)
            })
        } else if (error) {
            res.render("error-page.hbs", error)
        }
        else {
            model = {
                firstName: administrator.firstName,
                lastName: administrator.lastName,
                email: administrator.email,
                accesslevel: administrator.accesslevel
            }
            res.render("administrator.hbs", model)
        }
    })
})

router.get('/edit/:id', (req, res) => {
    const userId = req.session.userId

    authorization.getAccessLevelOfAdministratorId(userId).then(accesslevel => {

        if (!authorization.privilegiesOfAccessLevel.administrators.edit.includes(accesslevel)) {
            model = {
                code: 403,
                message: "You need to be logged in to edit administrators"
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
                    accesslevel: administrator.accesslevel
                }

                for (let i = 1; i <= accesslevel; i++) {
                    model[authorization.accessLevels[i]] = true
                }
                res.render("edit-administrator.hbs", model)

            })
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

router.post('/edit/:id', (req, res) => {
    let newValues = req.body
    newValues.id = req.params.id
    const userId = req.session.userId

    administratorManager.updateAdministrator(newValues, userId, (validationErrors, error, administrator) => {
        if (validationErrors.length) {
            let model = {
                id: req.params.id,
                validationError: true,
                errors: validationErrors
            }
            authorization.getAccessLevelOfAdministratorId(userId).then(accesslevel => {

                for (let i = 1; i <= accesslevel; i++) {
                    model[authorization.accessLevels[i]] = true
                }
                res.render("edit-administrator.hbs", model)
            })
        } else if (error) {
            res.render("error-page.hbs", error)

        }
        else {
            authorization.getAccessLevelOfAdministratorId(userId).then(accesslevel => {
                const model = {
                    id: administrator.get('id'),
                    firstName: administrator.get('firstName'),
                    lastName: administrator.get('lastName'),
                    email: administrator.get('email'),
                    accesslevel: administrator.get('accesslevel')
                }

                for (let i = 1; i <= accesslevel; i++) {
                    model[authorization.accessLevels[i]] = true
                }
                res.render("administrator.hbs", model)
            })
        }
    })

})

module.exports = router