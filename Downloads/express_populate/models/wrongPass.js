const mongoose = require("mongoose");
//const jwt = require("jwt");
const bcrypt = require("bcrypt");
const newUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user:
    {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true
    },
    role:
    {
        type: Number,
        required: false,
        default: 2
    },
    failedLoginAttempt:
    {
        type: Number,
        default: 0,
        required: false
    },
    timestamp: { type: Date }

}, { timestamps: true }
)
const newUser = mongoose.model("newUser", newUserSchema);
module.exports = newUser;