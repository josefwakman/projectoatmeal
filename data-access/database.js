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
        name: "Anders von Beetow"
    },
    {
        id: 3,
        name: "M. Bartoscheck"
    },
    {
        id: 4,
        name: "J. von Anka"
    },
    {
        id: 5,
        name: "John McLane"
    },
    {
        id: 6,
        name: "Mr .X"
    }
]

books = [
    {
        id: 0,
        title: "Yo",
        ISBN: 1
    },
    {
        id: 1,
        title: "Woop Woop",
        ISBN: 2
    },
    {
        id: 3,
        title: "Harry Potter and the Somewhat Unengaged Chemistry Professor",
        ISBN: 3
    },
    {
        id: 4,
        title: "A Night at the Chicago opera House",
        ISBN: 4
    },
    {
        id: 5,
        title: "Harry Potter and Another Test Title",
        ISBN: 5
    },
    {
        id: 6,
        title: "Du bist eine Kartoffel, Harry",
        ISBN: 6
    }
]

bookAuthors = [
    {
        ISBN: 1,
        authorID: 1
    },
    {
        ISBN: 2,
        authorID: 1
    },
    {
        ISBN: 2,
        authorID: 2
    },
    {
        ISBN: 3,
        authorID: 4
    },
    {
        ISBN: 4,
        authorID: 5
    },
    {
        ISBN: 5,
        authorID: 6
    },
    {
        ISBN: 6,
        authorID: 1
    },
    {
        ISBN: 6,
        authorID: 3
    },
]

// -----------------

function getAuthor(authorID) {
    return authors.find((author) => {
        return author.id == authorID
    })
}

function findAuthorsOfBook(ISBN) { // returns array of authors belonging to book, even if just one
    const foundBookAuthors = bookAuthors.filter((bookAuthor) => {
        return bookAuthor.ISBN == ISBN
    })
    
    return foundBookAuthors.map((foundBookAuthor) => {
        return getAuthor(foundBookAuthor.authorID)
    }) 
}

function searchBooks(query) {
    lowerCaseSearch = query.toLowerCase()
    let foundBooks = books.filter(function(book) {
        lowerCaseTitle = book.title.toLowerCase()
        return lowerCaseTitle.search(lowerCaseSearch) > -1
    })

    console.log(foundBooks);
    
    foundBooks = foundBooks.map((book) => {
        const foundAuthors = findAuthorsOfBook(book.ISBN)
        for (author of foundAuthors) {
            if (book.authors) {
                book.authors.push(author)
            } else {
                book.authors = [author]
            }
        }
        return book     
    })
    console.log(foundBooks);
    console.log("Authors of book[0]: " + JSON.stringify(foundBooks[0].authors));
    
    return foundBooks
}

function searchAuthors(query) {
    lowerCaseSearch = query.toLowerCase()
    const foundAuthors = authors.filter(function(author) {
        lowerCaseAuthor = author.name.toLowerCase()
        return lowerCaseAuthor.search(lowerCaseSearch) > -1
    })

    return foundAuthors
}



// ---- EXPORTS ---------

exports.searchBooks = searchBooks
exports.searchAuthors = searchAuthors