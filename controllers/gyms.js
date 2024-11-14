const Gym = require("../models/gym");
const Review = require("../models/review");
const User = require("../models/user");

module.exports.index = async (req, res) => {
    const gyms = await Gym.findAll({});
    res.render("gyms/index", { gyms });
};

module.exports.renderNewForm = (req, res) => {
    res.render("gyms/new");
};

module.exports.createGym = async (req, res, next) => {
    // if (!req.body.gym) throw new ExpressError("Invalid Gym Data!", 400);
    const gymData = {
        ...req.body.gym,
        author_id: req.user.id
    }
    const gym = await Gym.create(gymData);
    req.flash("success", "Successfully made a new gym!");
    res.redirect(`/gyms/${gym.id}`);
};

module.exports.showGym = async (req, res) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    if (!gym) {
        req.flash("error", "Cannot find that gym!");
        return res.redirect("/gyms");
    }

    const reviews = await Review.findAll({
        where: { gym_id: id }
    })
    for (let review of reviews) {
        const author = await User.findByPk(review.user_id);
        if (author) {
            review.dataValues.author = author;
        }
    }
    gym.dataValues.reviews = reviews;

    const user = await User.findByPk(gym.user_id);
    if (user) {
        gym.dataValues.user = user;
    }
    res.render("gyms/show", { gym, user: gym.dataValues.user, reviews: gym.dataValues.reviews });
};

module.exports.renderEditForm = async (req, res) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    if (!gym) {
        req.flash("error", "Cannot find that gym!");
        return res.redirect("/gyms");
    }
    res.render("gyms/edit", { gym });
};

module.exports.updateGym = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByPk(id);
    await gym.update({ ...req.body.gym });
    req.flash("success", "Successfully updated the gym!");
    res.redirect(`/gyms/${gym.id}`);
};

module.exports.destroyGym = async (req, res) => {
    const { id } = req.params;
    await Gym.destroy({ where: { id } });
    req.flash("success", "Successfully deleted the gym!");
    res.redirect("/gyms");
};