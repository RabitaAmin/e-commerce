const express = require("express");
const authroutes = express();
const mangaController = require("../controllers/controller");
const authController = require("../controllers/authController");
const validator = require("../middleware/validation");
const createValidate = require("../middleware/validate");
const authValidator = require("../middleware/authValidator")
const userValidator = require("../middleware/userValidator");
const auth = require("../middleware/auth");
const { validate } = require("../models/products");
authroutes.post("/signup", userValidator.create, authController.auth);
authroutes.post("/login", authController.logIn)
module.exports = authroutes;