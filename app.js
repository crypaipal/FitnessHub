const express = require("express");
const path = require("path");
const { connectDB, sequelize } = require("./config/database");
const Gym = require("./models/gym");
const ejsMate = require("ejs-mate");
const { gymSchema, reviewSchema } = require("./schemas.js");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/expressError");
const methodOverride = require("method-override");
const Review = require("./models/review");

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

const validateGym = (req, res, next) => {
    const { error } = gymSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/gyms", catchAsync(async (req, res) => {
    const gyms = await Gym.findAll({});
    res.render("gyms/index", { gyms });
}))

app.get("/gyms/new", (req, res) => {
    res.render("gyms/new")
})

app.post("/gyms", validateGym, catchAsync(async (req, res, next) => {
    // if (!req.body.gym) throw new ExpressError("Invalid Gym Data!", 400);
    const gym = await Gym.create(req.body.gym);
    res.redirect(`/gyms/${gym.id}`);
}))

app.get("/gyms/:id", catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    const reviews = await Review.findAll({
        where: { gym_id: id }
    })
    gym.dataValues.reviews = reviews; // dodaj reviews jako pole dla gyms
    res.render("gyms/show", { gym });
}))


app.get("/gyms/:id/edit", catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    res.render("gyms/edit", { gym });
}))

app.put("/gyms/:id", validateGym, catchAsync(async (req, res) => {
    const { id } = req.params;
    const findGym = await Gym.findByPk(id);
    const gym = await findGym.update({ ...req.body.gym });
    res.redirect(`/gyms/${gym.id}`);
}))

app.delete("/gyms/:id", async (req, res) => {
    const { id } = req.params;
    const findGym = await Gym.findByPk(id);
    const gym = await findGym.destroy();
    res.redirect("/gyms");
})

app.post("/gyms/:id/reviews", validateReview, catchAsync(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    const review = await Review.create({
        ...req.body.review,
        gym_id: gym.id
    });
    res.redirect(`/gyms/${gym.id}`);
}));

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