const administratorRepository = require("../DAL/administrator-repository")
const validator = require("./validation")
const hashing = require("./hashing")

const requiredAdministratorKeys = [
    "firstName",
    "lastName",
    "email",
    "privilegies",
    "password"
]

// ----- Functions ----------------

function getAdministrators() {
    // Någon typ av validation, är man inloggad?

    return administratorRepository.getAdministrators().then(administrators => {
        return administrators
    }).catch(error => {
        throw error
    })
}

function addAdministrator(administrator, callback) {

    const errors = validator.validateAdministrator(administrator)
    const missingKeys = validator.getMissingKeys(administrator, requiredAdministratorKeys)
    for (missingKey of missingKeys) {
        errors.push("Nothing entered in " + missingKey)
    }
    if (0 < errors.length) {
        callback(errors)

    } else {

        hashing.generateHashForPassword(administrator.password).then(hashedPassword => {
            
            administrator.password = hashedPassword
            administratorRepository.addAdministrator(administrator).then(addedAdministrator => {
                callback([], null, addedAdministrator)
    
            }).catch(error => {
                callback([], error)
            })

        }).catch(error => {
            callback([], error)
        })
    }
}

function updateAdministrator(administrator, callback) {
    const errors = validator.validateAdministrator(administrator)

    if (errors.length) {
        callback(errors)

    } else {

        if (administrator.password) {
            hashing.generateHashForPassword(administrator.password).then(hashedPassword => {
                administrator.password = hashedPassword
                administratorRepository.updateAdministrator(administrator).then(updatedAdministrator => {
                    callback([], null, updatedAdministrator)
    
                })
            }).catch(error => {
                callback([], error)
            })
        }
        else {

            administratorRepository.updateAdministrator(administrator).then(updatedAdministrator => {
                callback([], null, updatedAdministrator)

            }).catch(error => {
                callback([], error)
            })
        }
    }
}


function getAdministratorWithId(id) {
    return administratorRepository.getAdministratorWithId(id).then(administrator => {
        return administrator
    }).catch(error => {
        throw error
    })
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

exports.getAdministrators = getAdministrators
exports.addAdministrator = addAdministrator
exports.updateAdministrator = updateAdministrator
exports.getAdministratorWithId = getAdministratorWithId
exports.getAdministratorWithCredentials = getAdministratorWithCredentials