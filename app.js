const express = require("express")
const expressHandlebars = require("express-handlebars")

const app = express()

const path = require('path')

// -----------

app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.use(express.static(path.join(__dirname, '/public')))

// Vi använder routers istället för det här sen va?
// --- GET Requests ----------

app.get('/', function(req, res) {
    res.render("home.hbs")
})



app.listen(8080)