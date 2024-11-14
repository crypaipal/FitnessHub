const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");
const users = require("../controllers/users");
const { storeReturnTo } = require("../middleware");

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register));

// use the storeReturnTo middleware to save the returnTo value from session to res.locals
// passport.authenticate logs the user in and clears req.session
// then we can use res.locals.returnTo to redirect the user after login
router.route("/login")
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate("local",
        {
            failureFlash: true,
            failureRedirect: "/login"
        }),
        users.login);

router.get("/logout", users.logout);

module.exports = router;