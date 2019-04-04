const administratorRepository = require('../DAL/administrator-repository')

const accessLevels = Object.freeze({
    1: "admin",
    2: "superAdmin",
    3: "adminSupreme",
})

const privilegiesOfAccessLevel = {
    administrators: {
        add: [
            3
        ],
        edit: [
            3
        ],
        delete: [
            3
        ],
        changePassword: [
            2, 3
        ]
    },
    books: {
        add: [
            1, 2, 3
        ],
        edit: [
            1, 2, 3
        ],
        delete: [
            1, 2, 3
        ],
    },
    authors: {
        add: [
            1, 2, 3
        ],
        edit: [
            1, 2, 3
        ],
        delete: [
            1, 2, 3
        ],
    }
}

function getAccessLevelOfAdministratorId(id) {
    return new Promise((resolve, reject) => {
        administratorRepository.getAdministratorWithId(id).then(administrator => {
            if (!administrator) {
                resolve(false)
            } 
            else {
                resolve(administrator.get('privilegies'))
            }
        })
    })
}

exports.accessLevels = accessLevels
exports.privilegiesOfAccessLevel = privilegiesOfAccessLevel
exports.getAccessLevelOfAdministratorId = getAccessLevelOfAdministratorId