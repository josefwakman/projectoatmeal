const privilegies = Object.freeze({
    "admin": 1,
    "superAdmin": 2
})

const validBookKeys = [
    "ISBN",
    "title",
    "signID",
    "publicationYear",
    "publicationCity",
    "publicationCompany",
    "pages"
]

const validAuthorKeys = [
    "ID",
    "firstName",
    "lastName",
    "birthYear"
]


// Returns an array of errors. If there are no error, the array is empty
function validateBook(book) {
    let errors = []

    const validISBN = RegExp(/^\d{1,10}$/)
    const validSignID = RegExp(/^\d+$/)
    const validYearFormat = RegExp(/^\d{4}$/)
    const invalidCity = RegExp(/\d/)
    const validPages = RegExp(/^\d+$/)

    for (key of Object.keys(book)) 
    {
        switch (key) {
            case "title":
                if (book.title == "") {
                    errors.push("Nothing entered as title")
                }
                break
            case "ISBN":
                if (!validISBN.test(book.ISBN)) {
                    errors.push("ISBN not entered correctly. Only numbers allowed, at most 10")
                }
                break
            case "signID":
                if (!validSignID.test(book.signID)) {
                    errors.push("SignID not entered correctly. Only numbers allowed.")
                }
                break
            case "publicationCity":
                if (book.publicationCity == "") {
                    errors.push("Nothing entered as publication city")
                } else if (invalidCity.test(book.publicationCity)) { // TODO: felsöka denna. verkar inte fungera som den ska
                    errors.push("No digits allowed in city names")
                }
                break
            case "publicationCompany":
                if (book.publicationCompany == "") {
                    errors.push("Nothing entered as publication company")
                }
                break
            case "publicationYear":
                if (!validYearFormat.test(book.publicationYear)) {
                    errors.push("PublicationYear not entered correctly. Only numbers allowed, must be 4 digits.")
                } else {
                    if (parseInt(book.publicationYear) > new Date().getFullYear()) {
                        errors.push("PublicationYear is after the current year, " + new Date().getFullYear() + ". Are you publishing from the future?")
                    }
                }
                break
            case "pages":
                if (!validPages.test(book.pages)) {
                    errors.push("Number of pages entered incorrectly. Only numbers allowed")
                }
                break
            default:
                errors.push("Wait this isn't a valid key!")
        }
    }

    return errors
}

function getMissingBookKeys(book) { // Denna behövs så att man inte kan skicka en post request som saknar fält vid create book
    const keysInBook = Object.keys(book)
    let missingKeys = []
    for (keyToCheck of validBookKeys) {
        if (!keysInBook.includes(keyToCheck)) {
            missingKeys.push(keyToCheck)
        }
    }
    return missingKeys
}



function validateAuthor(author) {
    let errors = []

    const invalidName = RegExp(/^[\d|,|.]/) // no digits, "," or "."
    const validYearFormat = RegExp(/^\d{4}$/) // only 4 digits allowed

    if (invalidName.test(author.firstName)) {

        errors.push("First name entered incorrectly. Only letters allowed.")
    }
    if (invalidName.test(author.lastName)) {
        errors.push("Last name entered incorrectly. Only letters allowed.")
    }
    if (!validYearFormat.test(author.birthYear)) {
        errors.push("Year entered incorrectly. Only 4 digits allowed.")
    } else {
        if (parseInt(author.birthYear) > new Date().getFullYear()) {
            errors.push("Birth year is after the current year, " + new Date().getFullYear() + ". Is this a time traveller?")
        }
    }

    console.log("Errors: " + errors);

    return errors
}

function validateAdministrator(admin) {
    let errors = []

    const invalidName = RegExp(/^[\d|,|.]/) // no digits, "," or "."
    const validEmail = RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)

    for (key of Object.keys(admin)) {
        switch (key) {
            case "firstName":
                if (invalidName.test(admin.firstName)) {
                    errors.push("First name entered incorrectly. Only letters allowed.")
                }
                break
            case "lastName":
                if (invalidName.test(admin.lastName)) {
                    error.push("Last name entered incorrectly. Only letters allowed.")
                }
                break
            case "email":
                if (!validEmail.test(admin.email)) {
                    errors.push("Email given is not valid")
                }
                break
            case "privilegies":
                if (Object.keys(privilegies).map(privKey => {
                    return privilegies[privKey]
                }).includes(admin[key])
                ) {
                    // woho
                }
                break
        }
    }
    return errors
}


// --- EXPORTS ---------------

exports.validateBook = validateBook
exports.getMissingBookKeys = getMissingBookKeys

exports.validateAuthor = validateAuthor

exports.validateAdministrator = validateAdministrator