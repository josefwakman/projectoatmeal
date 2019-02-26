const administratorRepository = require("../DAL/administrator-repository")
const validator = require("./validation")

function addAdministrator(administrator) {

    const missingKeys = validator.getMissingAdministratorKeys(administrator)
    validator.validateAdministrator(administrator).then(errors => {
        for (missingKey in missingKeys) {
            errors.push("Nothing entered in " + missingKey)
        }
        if (errors.length > 0) {
            throw errors
        } else {
            administratorRepository.addAdministrator(administrator).then(administrator => {
                return administrator
            }).catch(err => {
                throw err
            })
        }
    })


}

exports.addAdministrator = addAdministrator