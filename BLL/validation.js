
// Returns an array of errors. If there are no error, the array is empty
function validateBook(book) {
    let errors = []

    const validISBN = RegExp("^\d{1,10}$")
    const invalidSignID = RegExp("[\D]")
    const validYearFormat = RegExp("^\d{4}$")
    const validPublicationInfo = RegExp("^\S\D+ : [^,]+, ((1\d)|(20))\d{2}$") // "Only letters" : "not ,", "4 digit year, first two digits must be 20 or less" (assuming no books were written before year 1000)
    const validPages = RegExp("^\d+$")

    if (book.title == "") {
        errors.push("Nothing entered as title")
    }
    if (!validISBN.test(book.ISBN)) {
        errors.push("ISBN not entered correctly. Only numbers allowed, at most 10")
    }
    if (invalidSignID.test(book.signID)) {
        errors.push("SignID not entered correctly. Only numbers allowed.")
    }
    if (!validYearFormat.test(book.publicationYear)) {
        errors.push("PublicationYear not entered correctly. Only numbers allowed, must be 4 digits.")
    } else {
        if (int(book.publicationYear) > new Date().getFullYear) {
            errors.push("PublicationYear is after the current year, " + new Date().getFullYear + ". Are you publishing from the future?")
        }
    }
    if (!validPublicationInfo.test(book.publicationInfo)) {
        errors.push("TODO: bättre fält här")
    }
    if (!validPages.test(book.pages)) {
        errors.push("Number of pages entered incorrectly. Only numbers allowed")
    }

    return errors
}




// --- EXPORTS ---------------
exports.validateBook = validateBook