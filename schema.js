const joi = require("joi");
const review = require("./models/review");

const listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        price : joi.number().required().min(0),
        image : joi.string().allow("",null)
    }).required()
})


const reviewSchema = joi.object({
    review: joi.object({
        rating : joi.number().min(1).max(5).required(),
        comment : joi.string().required()
    }).required()
})
module.exports = { listingSchema, reviewSchema };