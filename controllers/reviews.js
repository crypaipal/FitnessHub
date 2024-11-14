const Gym = require("../models/gym");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    const review = await Review.create({
        ...req.body.review,
        gym_id: gym.id,
        user_id: req.user.id
    });
    req.flash("success", "Created new review!");
    res.redirect(`/gyms/${gym.id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // const findGym = await Gym.findByPk(id);
    // const gym = await findGym.update({ ...req.body.gym }); 
    const review = await Review.findByPk(reviewId);
    await review.destroy();
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/gyms/${id}`)
};