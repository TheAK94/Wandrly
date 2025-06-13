const Joi = require("joi");

const validCategories = [
    "Rooms",
    "Iconic cities",
    "Mountains",
    "Castles",
    "Beaches",
    "Camping",
    "Farms",
    "Arctic"
];

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string().valid(...validCategories).required(),
        image: {
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null).default("listingimage")
        }
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

module.exports.signupSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

module.exports.loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});