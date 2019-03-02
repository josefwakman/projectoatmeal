const administratorRepository = require("../DAL/administrator-repository")
const validator = require("./validation")

const validAdministratorKeys = [
    "firstName",
    "lastName",
    "email",
    "privilegies",
    "password"
]

// ----- Functions ----------------

function addAdministrator(administrator, callback) {

    const errors = validator.validateAdministrator(administrator)
    const missingKeys = validator.getMissingKeys(administrator, validAdministratorKeys)
    for (missingKey of missingKeys) {
        errors.push("Nothing entered in " + missingKey)
    }

    if (0 < errors.length) {
        callback(errors)

    } else {
        administratorRepository.addAdministrator(administrator).then(administrator => {
            callback([], administrator)
        }).catch(error => {
            callback([error])
        })
    }
}

function updateAdministrator(administrator, callback) {
    const errors = validator.validateAdministrator(administrator)

    administratorRepository.updateAdministrator(administrator).then(administrator => {
        callback(administrator)
    }).catch(error => {
        callback(null, error)
    })
}


function getAdministratorWithID(id, callback) {
    administratorRepository.getAdministratorWithID(id).then(administrator => {
        callback(administrator)
    }).catch(error => {
        callback(null, error)
    })
}

exports.addAdministrator = addAdministrator
exports.updateAdministrator = updateAdministrator
exports.getAdministratorWithID = getAdministratorWithID