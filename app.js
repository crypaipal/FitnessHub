const express = require("express");
const path = require("path");
const { connectDB, sequelize } = require("./config/database");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utilities/expressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const userRoutes = require("./routes/users");
const gymRoutes = require("./routes/gyms");
const reviewRoutes = require("./routes/reviews");

connectDB();
sequelize.sync()
    .then(() => {
        console.log("Synchronisation with the database successfully completed");
    })
    .catch((error) => {
        console.error("Database synchronisation error:", error);
    });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "thisShouldBeABetterSecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// Implementacja strategii lokalnej Passport.js
passport.use(new LocalStrategy(
    {
        usernameField: "email",
    },
    async (email, password, done) => {
        try {
            // Znajdź użytkownika po adresie e-mail
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return done(null, false, { message: "Incorrect email" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: "Incorrect password" });
            }
            // Zwróć użytkownika, jeśli uwierzytelnianie przebiegło pomyślnie
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


// Serializacja użytkownika (zapisywanie użytkownika do sesji)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializacja użytkownika (odczytywanie użytkownika z sesji)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get("/fakeUser", async (req, res) => {
    const password = "chicken";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({ email: "matvey@gmail.com", username: "cry", password: hashedPassword });
    res.send(user);
})

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/", userRoutes);
app.use("/gyms", gymRoutes);
app.use("/gyms/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.render("home");
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong!"
    res.status(statusCode).render("error", { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})