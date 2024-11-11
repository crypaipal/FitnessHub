const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/expressError");
const Gym = require("../models/gym");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware.js");

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

router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    const review = await Review.create({
        ...req.body.review,
        gym_id: gym.id
    });
    req.flash("success", "Created new review!");
    res.redirect(`/gyms/${gym.id}`);
}));

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // const findGym = await Gym.findByPk(id);
    // const gym = await findGym.update({ ...req.body.gym });
    const review = await Review.findByPk(reviewId);
    await review.destroy();
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/gyms/${id}`)
}))

module.exports = router;