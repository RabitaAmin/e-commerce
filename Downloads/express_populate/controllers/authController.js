const userModel = require("../models/users");
const authModel = require("../models/auth");
const newUserModel = require("../models/wrongPass");
const mangaModelLog = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { success, failure } = require("../write/message");
const { validationResult } = require("express-validator");
const SECRET_KEY = "myapi";
class authUser {
    async auth(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return res.status(400).send(failure("User insertion unsuccessful", validation));
            } else {
                const { name, email, password, phone, role } = req.body;

                const exist = await userModel.findOne({ email: email });
                if (exist) {
                    return res.status(400).send(failure("User already exists!"));
                }

                const hashedPass = await bcrypt.hash(password, 10);
                const resultUser = new userModel({ name: name, email: email, phone: phone });
                const savedUser = await resultUser.save();


                const resultAuth = new authModel({ name: name, email: email, password: hashedPass, role: role, user: savedUser._id });
                const savedAuth = await resultAuth.save();
                console.log(savedAuth)
                const token = jwt.sign({ email: savedAuth.email, id: savedAuth._id, role: savedAuth.role }, SECRET_KEY, { expiresIn: "1h" });
                console.log(`role is ${savedAuth.role}`)
                //return res.status(200).json({ user: resultAuth, token: token });
                return res.status(200).send(success("User has been Created", { user: resultAuth, token: token }))
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send(failure("Internal Server Error!"));
        }
    }
    async logInAuth(req, res) {
        try {
            let countAttempt = 0, flag = false;
            const { email, password } = req.body;
            const UserExist = await authModel.findOne({ email: email })
                .populate("user");

            if (!UserExist) {
                return res.status(400).send(failure("User not found!"));
            }
            else {
                const pass = await bcrypt.compare(password, UserExist.password);

                if (!pass) {
                    console.log("yoo")
                    countAttempt++;
                    UserExist.failedLoginAttempt += 1
                    await UserExist.save();
                    if (UserExist.failedLoginAttempt > 4) {
                        flag = true;
                        UserExist.timestamp = new Date();
                        await UserExist.save();
                        return res.status(400).send(failure("Too many Attempts!"));
                    }
                    return res.status(400).send("Wrong Credentials!");
                }
                if ((new Date() - UserExist.timestamp) > 1 * 60 * 1000) {
                    flag = false;;
                    UserExist.failedLoginAttempt = 0;
                    await authModel.updateOne({ email: email }, { $set: { failedLoginAttempt: 0 } });

                    //UserExist.timestamp = Date.now();
                    //await UserExist.save();
                }
                else {
                    const User = await authModel.findOne({ email: email })
                        .select("name email user _id")
                        .populate("user", "-createdAt -updatedAt");

                    const token = jwt.sign({ email: UserExist.email, id: UserExist._id, role: UserExist.role }, SECRET_KEY, { expiresIn: "1h" })
                    console.log(UserExist.role);
                    return res.status(200).send(success("Successfully logged-in", { result: User, token: token }))

                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error!");
        }
    }
    async logIn(req, res) {
        try {
            let countAttempt = 0, flag = false;
            const { email, password } = req.body;
            const UserExist = await authModel.findOne({ email: email })
                .populate("user");

            if (!UserExist) {
                return res.status(400).send(failure("User not found!"));
            }
            else {

                const pass = await bcrypt.compare(password, UserExist.password);

                if (!pass) {
                    return res.status(400).send("Wrong Credentials!");
                }
                else {
                    const User = await authModel.findOne({ email: email })
                        .select("name email user _id")
                        .populate("user", "-createdAt -updatedAt");

                    const token = jwt.sign({ email: UserExist.email, id: UserExist._id, role: UserExist.role }, SECRET_KEY, { expiresIn: "1h" })
                    console.log(UserExist.role);
                    return res.status(200).send(success("Successfully logged-in", { result: User, token: token }))

                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error!");
        }
    }
    // async logIn(req, res) {
    //     try {
    //         const maxAttempts = 3;
    //         const lockedDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    //         const resetDuration = 1 * 60 * 1000; // 1 minute in milliseconds
    //         const { email, password } = req.body;
    //         const UserExist = await authModel.findOne({ email: email })
    //             .populate("user");

    //         if (!UserExist) {
    //             return res.status(400).send(failure("User not found!"));
    //         }
    //         else {
    //             const pass = await bcrypt.compare(password, UserExist.password);
    //             if (flag) {
    //                 return res.status(400).send(failure("Can not login!Too many attempts"))
    //             }
    //             if (!pass) {
    //                 UserExist.failedLoginAttempt += 1;
    //                 await UserExist.save();
    //                 setTimeout(() => {
    //                     flag = false;
    //                     UserExist.failedLoginAttempt = 0;
    //                 }, 1 * 60 * 1000);
    //                 await UserExist.save();
    //                 if (UserExist.failedLoginAttempt > 3) {
    //                     flag = true;

    //                     return res.status(400).send("Cant log in!Too many attempts");
    //                 }
    //                 return res.status(400).send("Wrong credentials");
    //             }
    //             else {

    //                 const User = await authModel.findOne({ email: email })
    //                     .select("name email user _id")
    //                     .populate("user", "-createdAt -updatedAt");

    //                 const token = jwt.sign({ email: UserExist.email, id: UserExist._id }, SECRET_KEY, { expiresIn: "1h" })
    //                 return res.status(200).send(success("Successfully logged-in", { result: User, token: token }))

    //             }


    //         }
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).send(failure("Internal Server Error!"));
    //     }
    // }
    // async logIn(req, res) {
    //     try {
    //         const maxAttempts = 3;
    //         const lockedDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    //         const resetDuration = 1 * 60 * 1000; // 1 minute in milliseconds
    //         const { email, password } = req.body;

    //         const user = await authModel.findOne({ email }).populate("user");

    //         if (!user) {
    //             return res.status(400).send(failure("User not found!"));
    //         }

    //         if (user.failedLoginAttempt >= maxAttempts && user.lockedUntil > Date.now()) {
    //             // User is currently locked out
    //             return res.status(400).send(failure("Cant log in! Too many attempts"));
    //         }

    //         const pass = await bcrypt.compare(password, user.password);

    //         if (!pass) {
    //             user.failedLoginAttempt += 1;
    //             await user.save();

    //             if (user.failedLoginAttempt >= maxAttempts) {
    //                 // Lock the user out for a specified duration
    //                 user.lockedUntil = Date.now() + lockedDuration;
    //                 await user.save();

    //                 // Schedule a function to reset the failedLoginAttempt after 1 minute
    //                 setTimeout(async () => {
    //                     user.failedLoginAttempt = 0;
    //                     await user.save();
    //                 }, resetDuration);
    //             }

    //             return res.status(400).send(failure("Wrong credentials"));
    //         } else {
    //             // Successful login
    //             user.failedLoginAttempt = 0;
    //             await user.save();

    //             const token = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    //             return res.status(200).send(success("Successfully logged-in", { result: user, token }));
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).send(failure("Internal Server Error!"));
    //     }
    // }



}
module.exports = new authUser()