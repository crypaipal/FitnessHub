const Joi = require("joi");

module.exports.gymSchema = Joi.object({
    gym: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        images: Joi.array().items(Joi.object({
            url: Joi.string().required(),
            filename: Joi.string().required()
        })),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        comment: Joi.string().required(),
    }).required()
});
