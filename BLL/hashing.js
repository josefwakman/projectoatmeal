const bcrypt = require('bcryptjs')
const saltRounds = 10

function generateHashForPassword(password) {
    return new Promise((resolve, reject) => { 
        bcrypt.hash(password, saltRounds, (error, hash) => {
        
        if (error) {
            reject(error)
        }
        else {
            resolve(hash)
        }
    })
})
}

function compareHashAndPassword(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (error, result) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(result)
            }
        })
    })
}


exports.generateHashForPassword = generateHashForPassword
exports.compareHashAndPassword = compareHashAndPassword