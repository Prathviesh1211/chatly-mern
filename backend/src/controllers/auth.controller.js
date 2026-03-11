import { generateToken } from "../lib/utils.js";
import {sendWelcomeEmail} from "../emails/emailHandlers.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import "dotenv/config"

export const signup = async (req, res) => {

  const { fullName, email, password } = req.body;

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();

  try {

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be atleast 6 characters" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: "Invalid Email address" });
    }

    const user = await User.findOne({ email: trimmedEmail });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName: trimmedName,
      email: trimmedEmail,
      password: hashedPassword
    });

    const savedUser=await newUser.save();

    generateToken(savedUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email
    });

    try{
      await sendWelcomeEmail(savedUser.email,savedUser.fullName,process.env.CLIENT_URL);
    }catch(error){
      console.error("Failed to send welcome email : ",error);
    }

  } catch (error) {
    console.error("Error in Signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login=async()=>{

}
export const logout=async()=>{

}