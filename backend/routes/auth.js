const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register User
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, mobile, password } = req.body;

        const user = new User({
            fullName,
            email,
            mobile,
            password,
        });

        await user.save();
        console.log("Saved User:", user);
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}); 
// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login Email:", email);
        const user = await User.findOne({ email });
        console.log("User Found:", user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.password !== password) {
            console.log("Incorrect Password");
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login Successful",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;