const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const Gym = require("../models/gym");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    const review = await Review.create({
        ...req.body.review,
        gym_id: gym.id,
        user_id: req.user.id
    });
    req.flash("success", "Created new review!");
    res.redirect(`/gyms/${gym.id}`);
}));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // const findGym = await Gym.findByPk(id);
    // const gym = await findGym.update({ ...req.body.gym }); 
    const review = await Review.findByPk(reviewId);
    await review.destroy();
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/gyms/${id}`)
}))

module.exports = router;