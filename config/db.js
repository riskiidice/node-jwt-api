const Sequelize = require("sequelize");
const path = require("path");
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  // dialect: "mysql" | "sqlite" | "postgres" | "mssql",
  dialect: "sqlite",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: path.join(__dirname, "db.sqlite")
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// Or you can simply use a connection uri
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
module.exports = sequelize;
