//Handle database connection
const Sequelize = require("sequelize")
const sequelize = new Sequelize("Library", "ster1666", "gustaferik", {
    host: "cloudservices.cxfts5ufu8vm.eu-west-2.rds.amazonaws.com",
    dialect: "mysql",
    define: {
        timestamps: false
    }
})

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection established");
    })
    .catch(err => {
        console.error("Connection failed", err)
    })