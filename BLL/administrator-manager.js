const administratorRepository = require("../DAL/administrator-repository")
const validator = require("./validation")

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
        administratorRepository.addAdministrator(administrator).then(addedAdministrator => {
            console.log("Success!");
            callback([], addedAdministrator)
        }).catch(error => {
            callback([error])
        })
    }
}

function updateAdministrator(administrator, callback) {
    const errors = validator.validateAdministrator(administrator)
    if (errors) {
        callback(null, errors)
    } else {

        administratorRepository.updateAdministrator(administrator).then(administrator => {
            callback(administrator)
        }).catch(error => {
            callback(null, error) // TODO: proper error handling
        })
    }
}


function getAdministratorWithId(id) {
    return administratorRepository.getAdministratorWithId(id).then(administrator => {
        return administrator
    }).catch(error => {
        throw error
    })
}

exports.getAdministrators = getAdministrators
exports.addAdministrator = addAdministrator
exports.updateAdministrator = updateAdministrator
exports.getAdministratorWithId = getAdministratorWithId