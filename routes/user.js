const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
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

// Profile
router.route("/profile")
    .get(isLoggedIn, wrapAsync(userController.profile));

router.post('/bookings/:id/cancel', isLoggedIn, userController.cancelBooking);

router.post("/profile/delete", isLoggedIn, wrapAsync(userController.deleteAccount));

module.exports = router;