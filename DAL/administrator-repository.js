const { Administrators, Op } = require("./models")

function getAdministrators() {
    return Administrators.findAll()
}

function addAdministrator(administrator) {
    return Administrators.create({
        firstName: administrator.firstName,
        lastName: administrator.lastName,
        email: administrator.email,
        privilegies: administrator.privilegies,
        password: administrator.password
    }).then(administrator => {
        return administrator
    })
}

function updateAdministrator(newValues) {
    return Administrators.findOne({
        where: { id: newValues.id }
    }).then(administrator => {
        for (key of Object.keys(newValues)) {
            switch (key) {
                case "firstName":
                    administrator.firstName = newValues.firstName
                    break
                case "lastName":
                    administrator.lastName = newValues.lastName
                    break
                case "email":
                    administrator.email = newValues.email
                    break
                case "privilegies":
                    administrator.privilegies = newValues.privilegies
                    break
                case "password":
                    administrator.password = newValues.password
                    break
            }
        }
        return administrator.save()
    })
}

function getAdministratorWithId(id) {
    return Administrators.findOne({
        where: { id: id }
    })
}

function getAdministratorWithEmail(email) {
    return Administrators.findOne({
        where: { email: email }
    })
}

function getAccessLevelOfAdministratorWithId(id) {
    return Administrators.findOne({
        where: { id: id }
    }).then(administrator => {
        if (administrator) {
            return administrator.get('privilegies')
        } else {
            return null
        }
    })
}

exports.getAdministrators = getAdministrators
exports.addAdministrator = addAdministrator
exports.updateAdministrator = updateAdministrator
exports.getAdministratorWithId = getAdministratorWithId
exports.getAdministratorWithEmail = getAdministratorWithEmail
exports.getAccessLevelOfAdministratorWithId = getAccessLevelOfAdministratorWithId