const { body, query, param } = require("express-validator");

const authValidator = {
    create: [
        body("name")
            .exists()
            .withMessage("Name is missing")
            .bail()
            .notEmpty()
            .withMessage("Name can not be null")
            .bail()
            .isString()
            .withMessage("Name has to be a string")
            .bail()
            .isLength({ min: 2, max: 50 })
            .withMessage("Name must be less than 50 characters, and more than 2 characters"),
        body("email")
            .exists().withMessage('Email is missing')
            .bail()
            .isEmail().withMessage('Invalid email format'),
        body('password')
            .exists().withMessage('Password is missing')
            .bail()
            .notEmpty().withMessage('Password cannot be empty')
            .bail()
            .isStrongPassword().withMessage('Password must have a minimum length of 8.it shoild contain atleast one uppercase ,atleast one lower case letter,one numeric digit,one special character '),

    ],
};

module.exports = authValidator;




// const { body } = require("express-validator");

// const validator =
// {
//     create: [
//         body("name").exists().withMessage("This request should contain name property").isString().withMessage("Name should be string"),

//     ]
// }

// const express = require("express");
// const app = express();
// const { success, failure } = require("../write/message");

// const createValidation = (req, res, next) => {
//     const { name, price, category, brand, color, size } = req.body;
//     const errors = {};
//     if (name === "" || !name) {
//         errors.name = "Name is missing";
//     }

//     if (!price || price === "") {
//         errors.price = "Price is missing";
//     }
//     else if (price < 4) {
//         errors.pricelimit = "Price cant be less than 4";
//     }
//     if (!category || category === "") {
//         errors.stock = "Stock is missing";
//     }
//     if (!brand || brand === "") {
//         errors.stocklimit = "Stock cant be less than 10";
//     }
//     if (!color || color === "") {
//         errors.stocklimit = "Stock cant be less than 10";
//     }
//     if (!size || size === "") {
//         errors.author = "Author is missing";
//     }


//     if (Object.keys(errors).length > 0) {
//         const errorMessages = Object.keys(errors).map(field => errors[field]);
//         return { failure: true, message: errorMessages };
//     }
//     next();
// };

// module.exports = createValidation;
//module.exports = validator;