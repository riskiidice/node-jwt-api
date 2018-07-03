const Sequelize = require("sequelize");

const sequelize = require("../config/db");

const User = sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { min: 4, max: 20 }
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: { min: 4, max: 50 }
  }
});

// force: true will drop the table if it already exists
User.sync({ force: false }).then(() => {
  // Table created
});
module.exports = User;
