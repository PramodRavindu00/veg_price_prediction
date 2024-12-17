import User from "../models/UserModel.mjs";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/bcryptUtil.mjs";

export const registerUser = async (req, res) => {
  const { password, ...newUser } = req.body; //removing raw password from the user object
  const { email, contactNo } = newUser; //destructuring email and contact
  try {
    const isEmailRegistered = await User.findOne({ email });
    if (isEmailRegistered) {
      return res.status(409).json({
        success: false,
        type: "email",
        message: "Email is already registered",
      });
    }

    const isContactNoRegistered = await User.findOne({ contactNo });
    if (isContactNoRegistered) {
      return res.status(409).json({
        success: false,
        type: "contact",
        message: "Contact no is already registered",
      });
    }
    const hashedPassword = await hashPassword(password);
    const userWithHashedPassword = {
      //spreading a new object with hashed password
      ...newUser,
      password: hashedPassword, //hashing the password
    };

    const userToRegister = User(userWithHashedPassword);

    await userToRegister.save();
    res
      .status(201)
      .json({ success: true, message: "New user account created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const isPasswordValid = await verifyPassword(password, validUser.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      { id: validUser._id, role: validUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    if (!token) {
      console.error("JWT token didn't created");
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 600000,
    });

    const loggedUser = {
      id: validUser._id,
      userType: validUser.userType,
    };

    res.status(200).json({
      success: true,
      loggedUser: loggedUser,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: new Date(0),
    });

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

export const validateToken = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ success: true, data: decodedToken });
  } catch (error) {
    console.error("Invalid or expired token");
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
