const jwt = require('jsonwebtoken')

function createToken(id) {
    const claims = {
        sub: id, // subject
        iss: 'Project Oatmeal' // issuer
    }
    const token = jwt.sign(claims, "1dlvatten2,5dlhavregryn")
    return token
}

// ----------------
//      Exports
//------------------

exports.createToken = createToken