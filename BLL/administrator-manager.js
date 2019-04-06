const administratorRepository = require("../DAL/administrator-repository")
const validator = require("./validation")
const hashing = require("./hashing")
const authorization = require("./authorization")

const requiredAdministratorKeys = [
    "firstName",
    "lastName",
    "email",
    "accessLevels",
    "password"
]

// ----- Functions ----------------

function getAdministrators() {
    return administratorRepository.getAdministrators()
}

function addAdministrator(administrator, userId, callback) {

    administratorRepository.getAccessLevelOfAdministratorWithId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.administrators.add.includes(accessLevel)) {
            const error = {
                code: 403,
                message: "Not authorized to add administrators"
            }
            callback([], error)
        }

        else {

            const validationErrors = validator.validateAdministrator(administrator)
            const missingKeys = validator.getMissingKeys(administrator, requiredAdministratorKeys)
            for (missingKey of missingKeys) {
                validationErrors.push("Nothing entered in " + missingKey)
            }
            if (0 < validationErrors.length) {
                callback(validationErrors)

            } else {

                hashing.generateHashForPassword(administrator.password).then(hashedPassword => {

                    administrator.password = hashedPassword
                    administratorRepository.addAdministrator(administrator).then(addedAdministrator => {
                        callback([], null, addedAdministrator)

                    })
                })
            }
        }
    }).catch(serverError => {
        console.log(serverError)
        const error = {
            code: 500,
            message: "Internal server error"
        }
        callback([], error)
    })
}

function updateAdministrator(administrator, userId, callback) {

    administratorRepository.getAccessLevelOfAdministratorWithId(userId).then(accessLevel => {
        if (!authorization.privilegiesOfAccessLevel.administrators.edit.includes(accessLevel)) {
            const error = {
                code: 403,
                message: "Not authorized to edit administrator"
            }
            callback([], error)
        }

        else {

            const validationErrors = validator.validateAdministrator(administrator)

            if (validationErrors.length) {
                callback(validationErrors)

            } else {

                if (administrator.password) {
                    hashing.generateHashForPassword(administrator.password).then(hashedPassword => {
                        administrator.password = hashedPassword
                        administratorRepository.updateAdministrator(administrator).then(updatedAdministrator => {
                            callback([], null, updatedAdministrator)

                        })
                    })
                }
                else {

                    administratorRepository.updateAdministrator(administrator).then(updatedAdministrator => {
                        callback([], null, updatedAdministrator)
                    })
                }
            }
        }
    }).catch(serverError => {
        console.log(serverError)
        const error = {
            code: 500,
            message: "Internal server error"
        }
        callback([], error)
    })
}


function getAdministratorWithId(id) {
    return administratorRepository.getAdministratorWithId(id)
}

function getAdministratorWithCredentials(email, password) {
    return administratorRepository.getAdministratorWithEmail(email).then(administrator => {
        if (administrator) {

            return hashing.compareHashAndPassword(password, administrator.get("password")).then(result => {
                if (result) {
                    return administrator
                }
                else {
                    return false
                }
            })
        }
        else {
            return false
        }
    })
}

function deleteAdministratorWithId(adminId, callback) {

    administratorRepository.getAccessLevelOfAdministratorWithId(adminId).then(accessLevel => {
        if(!authorization.privilegiesOfAccessLevel.administrators.delete.includes(accessLevel)){
            const error = {
                code: 403,
                message: "You're not authorized to delete this administrator"
            }
            callback(error)
        }else{
            
            administratorRepository.deleteAdministratorWithId(adminId).then(deletedAdmin => {
                callback(null, deletedAdmin)
            })

        }
    })
}

exports.getAdministrators = getAdministrators
exports.addAdministrator = addAdministrator
exports.updateAdministrator = updateAdministrator
exports.getAdministratorWithId = getAdministratorWithId
exports.getAdministratorWithCredentials = getAdministratorWithCredentials
exports.deleteAdministratorWithId = deleteAdministratorWithId