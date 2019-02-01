const express = require("express")
const expressHandlebars = require("express-handlebars")

const app = express()

const path = require('path')

// -----------

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))

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
        title: "Harry Potter and the Somewhat Unengaged Chemistry Proffesor",
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

app.use(express.static(path.join(__dirname, '/public')))

// Vi använder routers istället för det här sen va?
// --- GET Requests ----------

app.get('/', function(req, res) { 
    res.render("search-books.hbs")
})

app.get('/search-books', function(req, res) { 
    model = {searched: false}

    if (0 < Object.keys(req.query).length) {

        lowerCaseSearch = req.query.search.toLowerCase()
        const foundBooks = books.filter(function(book) {
            lowerCaseTitle = book.title.toLowerCase()
            return lowerCaseTitle.search(lowerCaseSearch) > -1
        })
        foundTitles = foundBooks.map((book) => book.title)
        
        model = {
            searched: true,
            books: foundBooks
        }
    }

    res.render("search-books.hbs", model)
})

app.get('/search-authors', function(req, res) {
    model = {searched: false}

    if (0 < Object.keys(req.query).length) {

        lowerCaseSearch = req.query.search.toLowerCase()
        const foundBooks = books.filter(function(book) {
            lowerCaseAuthor = book.author.toLowerCase()
            return lowerCaseAuthor.search(lowerCaseSearch) > -1
        })
        foundAuthors = foundBooks.map((book) => book.author)
        
        model = {
            searched: true,
            authors: foundAuthors
        }
    }
    console.log(model);
    
    res.render("search-authors.hbs", model)
})

app.get('/administrators', function(req, res) {
    model = {
        administrators: administrators
    }
    res.render("administrators.hbs", model)
})

app.get('/administrator/:id', (req, res) => {
    foundAdmin = administrators.filter((admin) => {
            return admin.id == req.params.id
        })
    res.render("administrator.hbs", foundAdmin[0])
})

app.get('/login', function(req, res) {
    res.render("login.hbs")
})

app.get('/book/:id', (req, res) => {
    foundBook = books.filter((book) => {
        return book.id == req.params.id
    })
    console.log(foundBook[0]);
    
    res.render("book.hbs", foundBook[0])
})

app.get('/author', (req, res) => {
    model = {
        name: "placeholder name",
        bio: 'Own a musket for home defense, since thats what the founding fathers intended. Four ruffians break into my house. "What the devil?" As I grab my powdered wig and Kentucky rifle. Blow a golf ball sized hole through the first man, he is dead on the spot. Draw my pistol on the second man, miss him entirely because it is smoothbore and nails the neighbors dog. I have to resort to the cannon mounted at the top of the stairs loaded with grape shot, "Tally ho lads" the grape shot shreds two men in the blast, the sound and extra shrapnel set off car alarms. Fix bayonet and charge the last terrified rapscallion. He Bleeds out waiting on the police to arrive since triangular bayonet wounds are impossible to stitch up. Just as the founding fathers intended.',
        books: [
            {
                title: "Yo yo"
            },
            {
                title: "Just another placeholder"
            },
            {
                title: "hold this place for me will ya?"
            }
        ]
    }
    res.render("author.hbs", model)
})


// ---------------------------------------

app.listen(8080)