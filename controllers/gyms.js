const Gym = require("../models/gym");
const Review = require("../models/review");
const User = require("../models/user");
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const gyms = await Gym.findAll({});
    const gymsGeoJSON = gyms.map(gym => ({
        type: 'Feature',
        geometry: gym.geometry,
        properties: {
            popUpMarkup: `<strong><a href="/gyms/${gym.id}">${gym.name}</a></strong>
            <p>${gym.description ? gym.description.substring(0, 20) + '...' : ''}</p>`
        }
    }));
    res.render("gyms/index", { gyms, gymsGeoJSON: JSON.stringify(gymsGeoJSON) });
};

module.exports.renderNewForm = (req, res) => {
    res.render("gyms/new");
};

module.exports.createGym = async (req, res, next) => {
    // if (!req.body.gym) throw new ExpressError("Invalid Gym Data!", 400);
    const geoData = await maptilerClient.geocoding.forward(req.body.gym.location, { limit: 1 });
    if (!geoData || !geoData.features || geoData.features.length === 0) {
        req.flash("error", "Can't find this place. Please, provide good address.");
        return res.redirect("/gyms/new");
    }
    const gymData = {
        ...req.body.gym,
        user_id: req.user.id,
        geometry: {
            type: "Point",
            coordinates: geoData.features[0].geometry.coordinates
        }
    };
    gymData.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
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
    const existingImages = gym.images || [];
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    let updatedImages = [...existingImages, ...newImages];
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        updatedImages = updatedImages.filter(image => !req.body.deleteImages.includes(image.filename));
    }
    const geoData = await maptilerClient.geocoding.forward(req.body.gym.location, { limit: 1 });
    if (geoData.features && geoData.features.length > 0) {
        gym.geometry = geoData.features[0].geometry;
    }
    else {
        req.flash("error", "Geolocation not found, update aborted.");
        return res.redirect(`/gyms/${gym.id}`);
    }
    await gym.update({ ...req.body.gym, images: updatedImages, geometry: gym.geometry });

    req.flash("success", "Successfully updated the gym!");
    res.redirect(`/gyms/${gym.id}`);
};

module.exports.destroyGym = async (req, res) => {
    const { id } = req.params;
    await Gym.destroy({ where: { id } });
    req.flash("success", "Successfully deleted the gym!");
    res.redirect("/gyms");
};