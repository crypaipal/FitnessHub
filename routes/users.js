const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");
const User = require("../models/user");
const { storeReturnTo } = require("../middleware");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);
        const registerUser = await User.create({ email, username, password });
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to FitnessHub!");
            res.redirect("/gyms");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});


// use the storeReturnTo middleware to save the returnTo value from session to res.locals
// passport.authenticate logs the user in and clears req.session
// then we can use res.locals.returnTo to redirect the user after login
router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/gyms";
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You've successfully logged out");
        res.redirect("/gyms");
    });
});

module.exports = router;