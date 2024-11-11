const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/expressError");
const Gym = require("../models/gym");
const Review = require("../models/review");
const { gymSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");

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

router.get("/", catchAsync(async (req, res) => {
    const gyms = await Gym.findAll({});
    res.render("gyms/index", { gyms });
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("gyms/new");
})

router.post("/", isLoggedIn, validateGym, catchAsync(async (req, res, next) => {
    // if (!req.body.gym) throw new ExpressError("Invalid Gym Data!", 400);
    const gym = await Gym.create(req.body.gym);
    req.flash("success", "Successfully made a new gym!");
    res.redirect(`/gyms/${gym.id}`);
}))

router.get("/:id", catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    if (!gym) {
        req.flash("error", "Cannot find that gym!");
        return res.redirect("/gyms");
    }
    const reviews = await Review.findAll({
        where: { gym_id: id }
    })
    gym.dataValues.reviews = reviews; // dodaj reviews jako pole dla gyms
    res.render("gyms/show", { gym });
}))

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    if (!gym) {
        req.flash("error", "Cannot find that gym!");
        return res.redirect("/gyms");
    }
    res.render("gyms/edit", { gym });
}))

router.put("/:id", isLoggedIn, validateGym, catchAsync(async (req, res) => {
    const { id } = req.params;
    const findGym = await Gym.findByPk(id);
    const gym = await findGym.update({ ...req.body.gym });
    req.flash("success", "Successfully updated the gym!");
    res.redirect(`/gyms/${gym.id}`);
}))

router.delete("/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    // const findGym = await Gym.findByPk(id);
    const gym = await Gym.destroy({ where: { id } });
    req.flash("success", "Successfully deleted the gym!");
    res.redirect("/gyms");
})

module.exports = router;