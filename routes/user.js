const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {signupSchema, loginSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

const validateSignup = (req, res, next) => {
    let {error} = signupSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateLogin = (req, res, next) => {
    let {error} = loginSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Signup Routes
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
});

router.post("/signup", validateSignup, wrapAsync(async (req, res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wandrly!");
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));


// Login Routes
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", validateLogin, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), async (req, res) => {
    req.flash("success", "Welcome back to Wandrly!");
    res.redirect("/listings");
});

// Logout Route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    })
})


module.exports = router;