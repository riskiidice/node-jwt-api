const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const db = require("./config/db");
const auth_api = require("./routes/auth");

const app = express();
// Body parser middlewares
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

app.use("/api/v1/auth", auth_api);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
