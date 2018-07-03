const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../config/keys");

// Load Validation Module
// const validateRegisterInput = require("./../../validators/register");

// Load Model
const User = require("../model/User");

// @route GET /api/user/test
// @desc  Test users route
// @access Public
router.get("/test", (req, res) => {
  res.json({
    msg: "users work"
  });
});

// @route GET /api/user/register
// @desc  Register
// @access Public
router.post("/register", (req, res) => {
  // const { errors, isValid } = validateRegisterInput(req.body);

  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({
    where: { username: req.body.email }
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exist"
      });
    } else {
      const newUser = {
        username: req.body.username,
        password: req.body.password
      };

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.create({
            username: newUser.username,
            password: newUser.password
          })
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET /api/user/login
// @desc  Login User /return JWT Token
// @access Public
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Find user email
  User.findOne({
    where: { username: username }
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        email: "Username does not exist"
      });
    }
    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        };
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600 * 1000000
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({
          password: "Password Incorrect"
        });
      }
    });
  });
});
// @route GET /api/user/current
// @desc  Login User /return JWT Token
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    return res.json({
      id: req.user.id,
      username: req.user.username
    });
  }
);

module.exports = router;
