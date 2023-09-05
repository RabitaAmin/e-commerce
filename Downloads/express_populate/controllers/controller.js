const mangaModelLog = require("../models/model");
const mangaModel = require("../models/products");
const userModel = require("../models/users");
const authModel = require("../models/auth");
const transactionModel = require("../models/transactions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
//const mongoose = require('mongoose');
const { success, failure } = require("../write/message");
const { validationResult } = require("express-validator");
const validate = require("../middleware/validate")
const SECRET_KEY = "myapi";
class myResponse {
    async getAll(req, res) {
        try {
            // const result = await mangaModel.getAll();
            const products = await mangaModel.find({});
            if (products.length > 0) {
                mangaModelLog.createLogFile("Data has been fetched successfully");
                res.status(200).send(success("Data fetched successfully", { result: products, total: products.length }));
            }
            else {
                res.status(200).send(failure("No data available"));
            }
        } catch (error) {
            res.status(500).send(failure("Internal Server Error!"));

        }
    }
    async deletebyId(req, res) {
        try {
            const { id } = req.query;
            const products = await mangaModel.deleteOne({ _id: id });
            if (products.deletedCount > 0) {
                mangaModelLog.createLogFile("Data has been deleted successfully")
                res.status(200).send(success("Data successfully deleted!"));
            }
            else {
                res.status(400).send(failure("Id is not found"));
            }
        } catch (error) {
            res.status(500).send(failure("Something went wrong"));
        }
    }
    async getOneById(req, res) {
        try {
            const { id } = req.query;
            const products = await mangaModel.findById({ _id: id });

            if (products) {
                mangaModelLog.createLogFile("Data has been fetched successfully");
                res.status(200).send(success("Data found successfully", products));
            }
            else if (!products) {
                res.status(400).send(failure("Id not found!"));
            }
        } catch (error) {
            res.status(500).send(failure("Something went wrong"));
        }
    }

    async commonId(req, res) {
        try {
            const { id } = req.query;
            const result = await mangaModel.commonId(id);
            if (result.success) {
                mangaModel.createLogFile("Data has been fetched successfully");
                res.status(200).send(success("Data successfully fetched", result.data));
            }
            else {
                res.status(400).send(failure(result.message));
            }
        } catch (error) {
            res.status(400).send(failure("Something went wrong!"));
        }
    }
    async joinRating(req, res) {
        try {
            const { id, rating } = req.query;
            const result = await mangaModel.joinRating(id, rating);
            if (result.success) {
                mangaModel.createLogFile("Data has been fetched successfully");
                res.status(200).send(success("Data successfully fetched", result.data));
            }
            else {
                res.status(400).send(failure(result.message));
            }
        } catch (error) {
            res.status(400).send(failure("Something went wrong!"));
        }
    }
    async filterByCategory(req, res) {
        try {
            const { category } = req.query;
            const products = await mangaModel.find({ category: category });

            if (products.length > 0) {
                mangaModelLog.createLogFile("Data has been fetched successfully");
                res.status(200).send(success(` products found of ${category} category`, products));
            }
            else {
                res.status(400).send(failure("No data found"));
            }
        } catch (error) {
            res.status(500).send(failure("Something went wrong!"));

        }
    }
    async filterByCategoryRating(req, res) {
        try {
            const { category, rating } = req.query;
            // const category = req.query.category; // Get the category from the query parameter
            // const rating = parseFloat(req.query.rating);
            const products = await mangaModel.find({ category: category, rating: { $gt: rating } });

            if (products.length > 0) {
                //mangaModel.createLogFile("Data has been fetched successfully");
                res.status(200).send(success(`${products.length} products found of ${category} category`, products));
            }
            else {
                res.status(400).send(failure("No data found"));
            }
        } catch (error) {
            res.status(500).send(failure("Something went wrong!"));

        }
    }
    async filterByBrand(req, res) {
        try {
            const { brand } = req.query;
            const products = await mangaModel.find({ brand: brand });

            if (products.length > 0) {
                //mangaModel.createLogFile("Data has been fetched successfully");
                res.status(200).send(success(`${products.length} products found of ${brand} category`, products));
            }
            else {
                res.status(400).send(failure("No data found"));
            }
        } catch (error) {
            res.status(500).send(failure("Something went wrong!"));

        }

    }
    async filterByName(req, res) {
        try {
            const { name } = req.query;
            const products = await mangaModel.find({ name: name });

            if (products.length > 0) {
                res.status(200).send(success(`${products.length} products found of name ${name}`, products));
            }
            else {
                res.status(400).send(failure("No product found!"));
            }
        } catch (error) {
            res.status(500).send(failure("Something went wrong!"));

        }

    }
    async categorySort(req, res) {
        try {
            const { category } = req.query;
            const products = await mangaModel.find({ category: category }).sort({ rating: -1 });

            if (products.length > 0) {

                res.status(200).send(success(`${products.length} products found of ${category} category`, products));
            }
            else {
                res.status(400).send(failure("No data found"));
            }
        } catch (error) {
            res.status(500).send(failure("Something went wrong!"));

        }
    }
    async create(req, res) {
        try {
            const validation = validationResult(req).array();
            console.log(validation);
            if (validation.length === 0) {
                const product = req.body;
                const result = await mangaModel.add(product);
                if (result.success) {
                    return res.status(200).send(success("Successfully added the product", result.data));
                } else {
                    return res.status(200).send(failure("Failed to add the product"));
                }
            } else {
                // return res.status(422).send(failure("Invalid inputs provided", validation));
                const validationErrors = validation.map(error => error.msg); // Extract error messages
                return res.status(422).send(failure("Invalid inputs provided", validationErrors));
            }
        } catch (error) {
            return res.status(500).send(failure("Internal server error"));
        }
    }
    async filterByReviewLen(req, res) {
        try {
            const { purchased_products, reviews_written } = req.query;
            const result = await mangaModel.filterByReviewLen(purchased_products, reviews_written);
            if (result.success) {
                res.status(200).send(success(`${result.data.length} user found`, result.data));
            }
            else {
                res.status(400).send(failure("Something went wrong!"));
            }

        } catch (error) {
            res.status(500).send("Internal Server Error!");
        }
    }


    async add(req, res) {
        try {
            const result = await mangaModel.add(req.body);
            if (result.success) {
                //createLogFile("Data has been added successfully")
                res.status(200).send(success("Data added successfully", result.data));
            }
            else if (!result.success) {
                res.status(500).send(failure(result.message));
            }
            else if (result.failure) {
                res.status(500).send(failure(result.message));
            }
        } catch (error) {
            res.status(400).send(failure("Something went wrong!"));

        }
    }
    async updatebyId(req, res) {

        try {
            const { id } = req.query
            const updateFields = {};


            for (const field in req.body) {
                if (field !== 'id') {
                    updateFields[field] = req.body[field];
                }
            }
            console.log(updateFields)
            const updateResult = await mangaModel.updateOne({ _id: id }, { $set: updateFields });
            res.status(200).send(success("Product updated successfully"));


        } catch (error) {
            res.status(500).send(failure("Something went wrong"));
        }
    }
    async createDb(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res.status(400).send(failure("Failed to add the product", validation));
            }
            else {
                const { name, price, category, stock, brand, color, size, rating } = req.body;
                const products = new mangaModel({ name: name, price: price, category: category, stock: stock, brand: brand, color: color, size: size, rating: rating });
                // if (req.userRole == 1) {
                //     await products.save()
                //         .then((data => {
                //             return res.status(200).send(success("Succesfully inserted data", data));
                //         }))
                // }
                // else {
                //     res.status(400).send(failure("Can't access the route"));
                // }
                await products.save()
                    .then((data => {
                        return res.status(200).send(success("Succesfully inserted data", data));
                    }))

            }


        } catch (error) {
            console.log(error);
            return res.status(500).send(failure("Data insertion Unsuccessful"));
        }

    }
    async auth(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res.status(400).send(failure("User insertion unsuccessful", validation));
            } else {
                const { name, email, password, phone, user } = req.body;

                const exist = await userModel.findOne({ email: email });
                if (exist) {
                    return res.status(400).send(failure("User already exists!"));
                }

                const hashedPass = await bcrypt.hash(password, 10);
                const resultUser = new userModel({ name: name, email: email, phone: phone });
                const savedUser = await resultUser.save();
                const token = jwt.sign({ email: savedUser.email, id: savedUser._id }, SECRET_KEY, { expiresIn: "1h" });
                const resultAuth = new authModel({ name: name, email: email, password: hashedPass, user: savedUser._id });
                const savedAuth = resultAuth.save();
                res.status(200).json({ user: resultAuth, token: token });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(failure("Internal Server Error!"));
        }
    }

    async createUser(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                res.status(400).send(failure("User insertion unsuccessful", validation));
            }
            const { name, email, password } = req.body;
            const exist = await userModel.findOne({ email: email });
            if (exist) {
                res.status(400).send(failure("User already exist!"));
            }
            const hashedPass = await bcrypt.hash(password, 10);//this function will run for 10times an then will be saved to the database
            const result = new userModel({ name: name, email: email, password: hashedPass });
            await result.save()
                .then(data => {
                    const token = jwt.sign({ email: data.email, id: data._id }, SECRET_KEY, { expiresIn: "1h" });
                    res.status(200).json({ user: data, token: token });
                })
                .catch(error => {
                    console.log(error)
                    res.status(400).send(failure("Could not insert data!"));
                });

        } catch (error) {
            console.log(error)
            res.status(500).send(failure("Internal Server Error!"));
        }
    }
    async logIn(req, res) {
        try {
            const { email, password } = req.body;
            const UserExist = await authModel.findOne({ email: email })
                .populate("user", "-password");

            if (!UserExist) {
                return res.status(400).send(failure("User not found!"));
            }
            const pass = await bcrypt.compare(password, UserExist.password);
            if (!pass) {
                return res.status(400).send(failure("Wrong Credentials"));
            }
            const User = await authModel.findOne({ email: email })
                .select("name email user _id")
                .populate("user");

            const token = jwt.sign({ email: UserExist.email, id: UserExist._id }, SECRET_KEY, { expiresIn: "1h" })
            return res.status(200).send(success("Succesfully logged-in", { result: User, token: token }))
            //res.status(200).json({ result: User, token: token });
        } catch (error) {
            console.log(error)
            res.status(500).send(failure("Internal Server Error!"));
        }
    }
    async createTransaction(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                res.status(400).send(failure("Cant add transaction!"));
            }
            let temp, temp1;
            let total = 0;
            let discount = 0;
            let badge = "none";
            const { user, products } = req.body;
            await Promise.all(products.map(async (product_id) => {
                const product = await mangaModel.findById({ _id: product_id.p_id })
                if (product._id == product_id.p_id) {
                    product.stock = product.stock - product_id.quantity
                    if (product.stock < 0) {
                        total -= product.price * product_id.quantity
                        product.save()
                        res.status(400).send(failure(`Don't have enough stock for ${product.name}`))
                    }
                    total += product.price * product_id.quantity
                    temp1 = total;
                    product.save()
                }

            }))
            if (total > 500 && total <= 2000) {
                temp = total;
                total = total - (total * (4 / 100));
                badge = "silver";
                discount = temp - total

            }
            else if (total > 2000 && total <= 3000) {
                temp = total;
                total = total - (total * (6 / 100));
                badge = "gold";
                discount = temp - total;
            }
            else {
                temp = total;
                total = total - (total * (8 / 100));
                badge = "platinum";
                discount = temp - total;
            }
            const result = new transactionModel({
                user: user, products: products, totalPrice: total, badge: badge, discountedPrice: discount

            })
            await result.save()
                .then(data => {
                    //console.log(products)
                    res.status(200).send(success("Transaction inserted successfully", data));
                })
                .catch(error => {
                    console.log(error);
                    res.status(400).send(failure("Dta could be inserted!"));
                })

        } catch (error) {
            res.status(500).send(failure("Internal Server Error!"));
        }
    }
    async getTransaction(req, res) {
        try {
            const result = await transactionModel.find({})
                .populate("user")
                .populate("products.p_id", "-createdAt -updatedAt  -__v")
            console.log(result);
            if (result.length > 0) {
                res.status(200).send(success("Data fetched successfully!", result))
            }
            else {
                res.status(400).send(failure("Could not fetch data!"));
            }

        } catch (error) {
            res.status(500).send(failure("Internal Server Error!"));

        }
    }

    async url(req, res) {
        res.status(500).send(failure("URL not found!"));
    }
}
module.exports = new myResponse();