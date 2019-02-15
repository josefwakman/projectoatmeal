const privilegies = Object.freeze({
    "admin" : 1,
    "superAdmin" : 2
})


// Returns an array of errors. If there are no error, the array is empty
function validateBook(book) {
    let errors = []

    const validISBN = RegExp(/^\d{1,10}$/)
    const validSignID = RegExp(/^\d+$/)
    const validYearFormat = RegExp(/^\d{4}$/)
    const invalidCity = RegExp(/\d/)
    const validPages = RegExp(/^\d+$/)

    if (book.title == "") {
        errors.push("Nothing entered as title")
    }
    if (!validISBN.test(book.ISBN)) {
        errors.push("ISBN not entered correctly. Only numbers allowed, at most 10")
    }
    if (!validSignID.test(book.signID)) {
        errors.push("SignID not entered correctly. Only numbers allowed.")
    }
    if (book.publicationCity == "") {
        errors.push("Nothing entered as publication city")
    } else if (invalidCity.test(book.publicationCity)) { // TODO: felsöka denna. verkar inte fungera som den ska
        errors.push("No digits allowed in city names")
    }
    if (book.publicationCompany == "") {
        errors.push("Nothing entered as publication company")
    }
    if (!validYearFormat.test(book.publicationYear)) {
        errors.push("PublicationYear not entered correctly. Only numbers allowed, must be 4 digits.")
    } else {
        if (parseInt(book.publicationYear) > new Date().getFullYear()) {
            errors.push("PublicationYear is after the current year, " + new Date().getFullYear() + ". Are you publishing from the future?")
        }
    }
    if (!validPages.test(book.pages)) {
        errors.push("Number of pages entered incorrectly. Only numbers allowed")
    }

    return errors
}



function validateAuthor(author) {
    let errors = []

    const validID = RegExp(/^\d{1,4}$/) // 1-4 digits allowed
    const invalidName = RegExp(/^[\d|,|.]/) // no digits, "," or "."
    const validYearFormat = RegExp(/^\d{4}$/) // only 4 digits allowed

    if (!validID.test(author.ID)) {
        errors.push("Id entered incorrectly. Only 1-4 digits allowed")
    }
    if (invalidName.text(author.firstName)) {
        errors.push("First name entered incorrectly. Only letters allowed.")
    }
    if (invalidName.text(author.lastName)) {
        errors.push("Last name entered incorrectly. Only letters allowed.")
    }
    if (!validYearFormat.test(author.birthYear)) {
        errors.push("Year entered incorrectly. Only 4 digits allowed.")
    } else {
        errors.push("Birth year is after the current year, " + new Date().getFullYear() + ". Is this a time traveller?")
    }

    return errors
}

function TODOvalidateAdministrator(admin) {
    let errors = []

    const validID = RegExp(/\d+/)
    const validEmail = RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)

    if (!validID.test(admin.ID)) {
        errors.push("ID entered incorrectly. Only digits allowed.")
    }
    if(admin.userName == "") {
        errors.push("No username entered")
    }
    if (!privilegies.contains(admin.privilegies)) {
        errors.push("No correct privilegies entered. Is it a " + privilegies[0] + " or " + privilegies[1] + "?")
    }
    if(!validEmail.test(admin.email)) {
        errors.push("No valid email entered")
    }
}


// --- EXPORTS ---------------

exports.validateBook = validateBook
exports.validateAuthor = validateAuthor