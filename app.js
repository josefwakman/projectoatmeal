const express = require("express")
const expressHandlebars = require("express-handlebars")

const app = express()

// -----------

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))


// Vi använder routers istället för det här sen va?
// --- GET Requests ----------

app.get('/', function(req, res) {
    res.render("home.hbs")
})



app.listen(8080)