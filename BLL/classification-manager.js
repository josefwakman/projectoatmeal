const classificationRepository = require("../DAL/classification-repository")

function getClassifications() {
    return classificationRepository.getClassifications()
}

exports.getClassifications = getClassifications