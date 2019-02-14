
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
        console.log("publicYear: " + book.publicationYear + ", getFullYear: " + new Date().getFullYear());
        
        if (parseInt(book.publicationYear) > new Date().getFullYear()) {
            errors.push("PublicationYear is after the current year, " + new Date().getFullYear() + ". Are you publishing from the future?")
        }
    }
    if (!validPages.test(book.pages)) {
        errors.push("Number of pages entered incorrectly. Only numbers allowed")
    }

    return errors
}




// --- EXPORTS ---------------
exports.validateBook = validateBook