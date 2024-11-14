const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/gyms";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You've successfully logged out");
        res.redirect("/gyms");
    });
};