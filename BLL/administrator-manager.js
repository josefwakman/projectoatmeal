const administratorRepository = require("../DAL/administrator-repository")
const validator = require("./validation")

function addAdministrator(administrator, callback) {

    const errors = validator.validateAdministrator(administrator)
    const missingKeys = validator.getMissingAdministratorKeys(administrator)
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

exports.addAdministrator = addAdministrator