const express = require("express");
const routes = express();
const mangaController = require("../controllers/controller");
const authController = require("../controllers/authController");
const validator = require("../middleware/validation");
const createValidate = require("../middleware/validate");
const authValidator = require("../middleware/authValidator")
const userValidator = require("../middleware/userValidator");
const auth = require("../middleware/auth");
const { validate } = require("../models/products");
routes.get("/", mangaController.getAll);

//population
//routes.get("/common", mangaController.commonId);
//population(searching using customer id with a specific rating or higher products)
//routes.get("/join", mangaController.joinRating);
routes.get("/category", mangaController.filterByCategory);
routes.get("/brand", mangaController.filterByBrand);
routes.get("/name", mangaController.filterByName);
//routes.get("/any", mangaController.filterByAny);
//routes.post("/add", validator.create, mangaController.create);
routes.put("/update", createValidate, mangaController.updatebyId);
routes.delete("/delete", mangaController.deletebyId);
//population(searching using category and fetching sorted data)
routes.get("/categorySort", mangaController.categorySort);
//customer purchased product and review based search
//routes.get("/length", mangaController.filterByReviewLen);
routes.get("/getbyid", mangaController.getOneById);
routes.get("/all", auth.auth, mangaController.getTransaction);
routes.post("/insert", auth.auth, auth.isRole, mangaController.createDb);
routes.post("/insertUser", mangaController.createUser);
routes.post("/signup", userValidator.create, authController.auth);
routes.post("/login", authController.logIn)
routes.post("/insertTransaction", mangaController.createTransaction);
routes.get("/categoryReview", mangaController.filterByCategoryRating);
routes.use("*", mangaController.url);
module.exports = routes;