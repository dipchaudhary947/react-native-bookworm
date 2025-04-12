import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        if(username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters long" });
        }

        // Check if user already exists
        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ message: "User already exists" });            
        }

        const existingUsername = await User.findOne({ username });
        if(existingUsername) {
            return res.status(400).json({ message: "Username already exists" });            
        }



        // Create new user
        // get random profile image

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const user = new User({ username, email, password,profileImage, });   

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({ 
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
         });

    } catch (error) {
        console.log("Error in register route",error);
        res.status(500).json({ message: error.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({ 
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
         });

    } catch (error) {
        console.log("Error in login route",error);
        res.status(500).json({ message: "Internal server error" });
        
    }
});

export default router;