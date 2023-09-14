const express = require("express");
const app = express();
const { success, failure } = require("../write/message");

const createValidation = (req, res, next) => {
    const { name, price, category, brand, color, size, rating, reviews } = req.body;
    const errors = {};
    if (name == "") {
        errors.name = "Name is missing";
    }

    if (price === "") {
        errors.price = "Price is missing";
    }
    else if (price < 4) {
        errors.pricelimit = "Price cant be less than 4";
    }
    if (category === "") {
        errors.stock = "Category is missing";
    }
    if (brand === "") {
        errors.brand = "Brand is missing";
    }
    if (color === "") {
        errors.color = "Color cant be less than 10";
    }
    if (size === "") {
        errors.size = "Size is missing";
    }

    if (rating === "") {
        errors.rating = "Rating is missing";
    }
    else if (rating <= 0 || rating > 5) {
        errors.ratingLimit = "Rating should be between 1 to 5";
    }


    if (Object.keys(errors).length > 0) {
        const errorMessages = Object.keys(errors).map(field => errors[field]);
        res.status(400).send({ data: errorMessages })

    }
    else {
        next();
    }
};

module.exports = createValidation;
//module.exports = validator;