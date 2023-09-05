// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();
// const databaseConnection = async (callback) => {
//     try {
//         const client = await mongoose.connect("mongodb+srv://RabitaAminBjit:fhABBc57GyQcEE1l@cluster0.rqxy4kg.mongodb.net/show")
//         if (client) {
//             console.log("successful")
//             callback();
//         }
//         else {
//             console.log("unsuccess");
//         }


//     } catch (error) {
//         console.log(error);
//     }
// }
// module.exports = databaseConnection;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const databaseConnection = async (callback) => {
    try {
        if (process.env.DATABASE_URL) {
            const client = await mongoose.connect(process.env.DATABASE_URL)
            if (client) {
                console.log("success");
                callback();
            }
            else {
                console.log("unsuccessful");
            }
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = databaseConnection;