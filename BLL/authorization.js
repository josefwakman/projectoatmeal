const administratorRepository = require('../DAL/administrator-repository')

const accessLevels = Object.freeze({
    1: "admin",
    2: "superAdmin",
    3: "adminSupreme",
})

function getAccessLevelOfAdministratorId(id) {
    return new Promise((resolve, reject) => {
        administratorRepository.getAdministratorWithId(id).then(administrator => {
            if (!administrator) {
                reject("No administrator with id: " + id)
            } 
            else {
                resolve(administrator.get('privilegies'))
            }
        })
    })
}

exports.accessLevels = accessLevels
exports.getAccessLevelOfAdministratorId = getAccessLevelOfAdministratorId