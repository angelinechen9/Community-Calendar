const express = require("express");
const authRoute = express.Router();
const {body, validationResult} = require("express-validator/check");
const {matchedData} = require("express-validator/filter");
const bcrypt = require("bcryptjs");
const {User} = require("../models/user.js");
const {validateUser} = require("../middleware/middleware.js");
authRoute.get("/register", (req, res) => {
  res.render("register.hbs");
})
authRoute.post("/register", [
  body("email")
  .isEmail()
  .withMessage("The email is invalid."),
  body("password")
  .isLength({min: 6})
  .withMessage("The password must be at least 6 characters.")
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(obj => {
      return {message: obj.msg};
    });
    req.flash("errorMessages", errorMessages);
    res.redirect("/register");
  }
  else {
    const user = new User({
      email: req.body.email,
      password: req.body.password
    })
    user.save()
    .then(user => {
      req.flash("successMessages", {message: "The registration is successful."});
      res.redirect("/login");
    })
    .catch(e => {
      if (e.code === 11000) {
        req.flash("errorMessages", {message: "The email is taken."});
      }
      res.redirect("/register");
    })
  }
})
authRoute.get("/login", (req, res) => {
  res.render("login.hbs");
})
authRoute.post("/login", (req, res) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if (!user) {
      req.flash("errorMessages", {message: "The email is not registered."});
      res.redirect("/login");
    }
    else {
      bcrypt.compare(req.body.password, user.password)
      .then(passwordIsValid => {
        if (passwordIsValid) {
          req.session.userId = user._id;
          res.redirect("/events");
        }
        else {
          req.flash("errorMessages", {message: "The password is invalid."});
          res.redirect("/login");
        }
      })
      .catch(e => {
        console.log(e);
      })
    }
  })
  .catch(e => {
    console.log(e);
  })
})
authRoute.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
})
module.exports = authRoute
