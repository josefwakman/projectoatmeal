const {Classifications} = require("./models")


function getClassifications() {
    return Classifications.findAll()
}

exports.getClassifications = getClassifications