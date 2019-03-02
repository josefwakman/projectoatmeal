const {Administrators} = require("./models")

function addAdministrator(administrator) {
    return Administrators.create({
        firstName: administrator.firstName,
        lastName: administrator.lastName,
        email: administrator.email,
        privilegies: administrator.privilegies,
        password: administrator.password
    }).then(administrator => {
        return administrator
    }).catch(err => {
        throw err
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
        administrator.save().then(administrator => {
            return administrator
        }).catch(error => { throw error })
    })
}

function getAdministratorWithID(id) {
    return Administrators.findOne({
        where: { id: id }
    }).then(administrator => {
        return administrator
    }).catch(error => {
        throw error
    })
}

exports.addAdministrator = addAdministrator
exports.updateAdministrator = updateAdministrator
exports.getAdministratorWithID = getAdministratorWithID