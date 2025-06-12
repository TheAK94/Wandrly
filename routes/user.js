const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {validateLogin, validateSignup} = require("../middleware.js");

const userController = require("../controllers/users.js");

// Signup Routes
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(validateSignup, wrapAsync(userController.signup));

// Login Routes
router.route("/login")
    .get(userController.renderLoginForm)
    .post(validateLogin, saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), userController.login);

// Logout Route
router.get("/logout", saveRedirectUrl, userController.logout);


module.exports = router;