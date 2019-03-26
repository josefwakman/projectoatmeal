const {Administrators, Sessions, Op} = require("./models")

function getAdministrators() {
    return Administrators.findAll().then(administrators => {
        return administrators
    }).catch(error => {
        throw error
    })
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
    }).catch(err => {
        throw err
    })
}

function updateAdministrator(newValues) {
    console.log(newValues);
    
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
    }).then(administrator => {
        return administrator
    }).catch(error => {
        throw error
    })
}

function getAdministratorWithCredentials(email, password) {
    return Administrators.findOne({
        where: {
            [Op.and]: [
                {
                    email: email
                }, {
                    password: password
                }
            ]  
        }
    })
}

function getSessionIdsWithAdministratorId(administratorId) {
    return Sessions.findAll({
        where: { administratorId: administratorId }
    })
}

function addSession(id, administratorId) {
    return Sessions.create({
        id: id,
        administratorId
    })
}

exports.getAdministrators = getAdministrators
exports.addAdministrator = addAdministrator
exports.updateAdministrator = updateAdministrator
exports.getAdministratorWithId = getAdministratorWithId
exports.getAdministratorWithCredentials = getAdministratorWithCredentials

exports.getSessionIdsWithAdministratorId = getSessionIdsWithAdministratorId
exports.addSession = addSession