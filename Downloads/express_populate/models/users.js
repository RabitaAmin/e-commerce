const mongoose = require("mongoose");
//const jwt = require("jwt");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        unique: true
    }
    

}, { timestamps: true }
)
// userSchema.pre("save", async (document, next) => {
//     try {
//         if (!document.isModified("password")) {
//             return next();
//         }
//         const hashedPass = await bcrypt.hash(document.password, 10)
//         document.password = hashedPass
//         next()
//     } catch (error) {
//         return next(error)
//     }
// })

const Users = mongoose.model("Users", userSchema);
module.exports = Users;