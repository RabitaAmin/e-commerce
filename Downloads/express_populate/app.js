const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const databaseConnection = require("./config/database");
const app = express();
const myRoutes = require("./routes/manga");
const authRoute = require("./routes/auth")
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use("/products", myRoutes);
app.use("/user", authRoute);
app.use(cors({ origin: "*" }));
databaseConnection(() => {
    app.listen(8000, () => {
        console.log(`Server is running on port ${8000}`)
    })
})