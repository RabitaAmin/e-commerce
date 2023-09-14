const express = require("express");
const { success, failure } = require("../write/message")
const jwt = require("jsonwebtoken");
const SECRET_KEY = "myapi";
class authentication {
    auth(req, res, next) {
        try {
            let token = req.headers.authorization;
            if (token) {
                token = token.split(" ")[1];
                let user = jwt.verify(token, SECRET_KEY);
                // req.userId = user.id;
                if (user) {
                    next()
                }
                else {
                    throw new Error();
                }
            }
            else {
                res.status(400).send("Unauthorized access!");
            }
        } catch (error) {
            console.log(error);
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(500).send(failure("Token Invalid"))
            }
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(500).send(failure("Please log in again"))
            }
            return res.status(500).send(failure("Token Expired"))
        }
    }

    isRole(req, res, next) {
        try {
            let token = req.headers.authorization;
            if (token) {
                token = token.split(" ")[1];
                const decodedToken = jwt.decode(token, SECRET_KEY);
                if (decodedToken) {

                    req.userRole = decodedToken.role;
                    console.log(`now ${req.userRole}`)
                    if (req.userRole == 1) {
                        next();
                    }
                    else {
                        res.status(400).send("Unauthorized access to this route");
                    }

                } else {
                    res.status(400).send("Invalid token!");
                }
            } else {
                res.status(400).send("Unauthorized users!");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = new authentication();
