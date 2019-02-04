// ---- PLACEHOLDERS - TO BE DELETED ----------------

administrators = [
    {
        id: 1776,
        name: "Thomas Jefferson",
        privilegies: "admin",
        email: "tea_party_lover@us.gov",
    },
    {
        id: 1789,
        name: "Marquis de Lafayette",
        privilegies: "admin",
        email: "fuckyourobespierre@merde.fr",
    },
    {
        id: 1812,
        name: "Simon Bolivar",
        privilegies: "superadmin",
        email: "1r0n4$$@sandomingoisnicethistimeofyear.vz",
    }
]

authors = [
    {
        id: 0,
        name: "Dandy MacBloom"
    },
    {
        id: 1,
        name: "Andy Beepmaster"
    },
    {
        id: 2,
        name: "DandyMacBloom"
    },
    {
        id: 3,
        name: "M. Bartoscheck"
    }
]

books = [
    {
        id: 0,
        title: "Yo",
        author: "Mr. X"
    },
    {
        id: 1,
        title: "Woop Woop",
        author: "Mr. X"
    },
    {
        id: 3,
        title: "Harry Potter and the Somewhat Unengaged Chemistry Professor",
        author: "Dandy MacBloom"
    },
    {
        id: 4,
        title: "A Night at the Chicago opera House",
        author: "Andy Beepmaster"
    },
    {
        id: 5,
        title: "Harry Potter and Another Test Title",
        author: "DandyMacBloom"
    },
    {
        id: 6,
        title: "Du bist eine Kartoffel, Harry",
        author: "M. Bartoscheck"
    }
]

// -----------------

function searchBooks(query) {
    lowerCaseSearch = query.toLowerCase()
        const foundBooks = books.filter(function(book) {
            lowerCaseTitle = book.title.toLowerCase()
            return lowerCaseTitle.search(lowerCaseSearch) > -1
        })
    return foundBooks
}



// ---- EXPORTS ---------

exports.searchBooks = searchBooks