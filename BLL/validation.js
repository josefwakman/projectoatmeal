const privilegies = Object.freeze({
    "admin": 1,
    "superAdmin": 2
})


// Returns an array of errors. If there are no error, the array is empty
function validateBook(book) {
    book = removeEmptyValues(book)

    const validISBN = RegExp(/^\d{1,10}$/) // TODO: lägg in så att man kan ha X på slutet och 13 tecken
    const validSignID = RegExp(/^\d+$/)
    const validYearFormat = RegExp(/^\d{4}$/)
    const invalidCity = RegExp(/\d/)
    const validPages = RegExp(/^\d+$/)

    let errors = []

    for (key of Object.keys(book)) {
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
                    errors.push("Number of pages entered incorrectly. Only positive numbers allowed")
                }
                break
            default:
                errors.push("Wait this isn't a valid key!")
        }
    }

    return errors
}



function validateAuthor(author) {
    let errors = []

    const invalidName = RegExp(/^[\d|,|.]/) // no digits, "," or "."
    const validYearFormat = RegExp(/^\d{4}$/) // only 4 digits allowed

    for (key of Object.keys(author)) {
        switch (key) {
            case "firstName":
                if (invalidName.test(author.firstName)) {

                    errors.push("First name entered incorrectly. Only letters allowed.")
                }
                break
            case "lastName":
                if (invalidName.test(author.lastName)) {
                    errors.push("Last name entered incorrectly. Only letters allowed.")
                }
                break
            case "birthYear":
                if (!validYearFormat.test(author.birthYear) && author.birthYear != "") {
                    errors.push("Year entered incorrectly. Only 4 digits allowed.")
                } else {
                    if (parseInt(author.birthYear) > new Date().getFullYear()) {
                        errors.push("Birth year is after the current year, " + new Date().getFullYear() + ". Is this a time traveller?")
                    }
                }
                break
        }
    }
    return errors
}

function validateAdministrator(admin) {
    let errors = []
    admin = removeEmptyValues(admin)

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
                if (!Object.keys(privilegies).map(privKey => {
                    return privilegies[privKey]
                }).includes(parseInt(admin[key]))
                ) {
                    errors.push("No valid privilegium given")
                }
                break
        }
    }
    return errors
}


// --- EXPORTS ---------------

exports.validateBook = validateBook

exports.validateAuthor = validateAuthor

exports.validateAdministrator = validateAdministrator

exports.removeEmptyValues = removeEmptyValues

exports.getMissingKeys = getMissingKeys

// --------------------------------------------

function removeEmptyValues(arr) {
    let newObject = {}
    for (key of Object.keys(arr)) {
        if (!arr[key] == "") {
            newObject[key] = arr[key]
        }
    }
    return newObject
}

function getMissingKeys(object, requiredKeys) {
    const givenKeys = Object.keys(object)
    let missingKeys = []

    for (requiredKey of requiredKeys) {
        if (!givenKeys.includes(requiredKey) || object[requiredKey] == "") {
            missingKeys.push(requiredKey)
        }
    }
    return missingKeys
}