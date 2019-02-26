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
        console.error(err);
    })
}

exports.addAdministrator = addAdministrator