const Sequelize = require("sequelize")
const sequelize = new Sequelize("Library", "ster1666", "gustaferik", {
    host: "cloudservices.cxfts5ufu8vm.eu-west-2.rds.amazonaws.com",
    dialect: "mysql",
    define: {
        timestamps: false
    }
})
const Op = Sequelize.Op

const Authors = sequelize.define("Authors", {

    // !!! fungerar det att skriva firstname: Sequelize.STRING istället? 

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    birthYear: {
        type: Sequelize.STRING,
        validate: { min: 0, max: new Date().getFullYear }
    }
})

const BookAuthors = sequelize.define("BookAuthors", {
    bookISBN: {
        type: Sequelize.STRING,
        references: {
            model: "Books",
            key: "ISBN"
        }
    },
    authorID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: "Authors",
            key: "id"
        }
    }
})

const Classifications = sequelize.define("Classifications", {
    signID: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    signum: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
})

const Books = sequelize.define("Books", {
    ISBN: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    signID: {
        type: Sequelize.INTEGER
    },
    publicationYear: {
        type: Sequelize.STRING,
        validate: { min: 0, max: new Date().getFullYear }
    },
    publicationInfo: {
        type: Sequelize.STRING
    },
    pages: {
        type: Sequelize.SMALLINT,
        validate: { min: 1 }
    }
})

const Administrators = sequelize.define("Administrators", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    privilegies: {
        type: Sequelize.INTEGER
    },
    password: {
        type: Sequelize.STRING
    }
})


// ----------- Exports -----------------
exports.Op = Op

exports.Administrators = Administrators
exports.Authors = Authors
exports.Books = Books
exports.BookAuthors = BookAuthors
exports.Classifications = Classifications