import { isValidObjectId } from "mongoose";
import User from "../models/UserModel.mjs";
import Market from "../models/MarketModel.mjs";
import Vegetable from "../models/VegetableModel.mjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.mjs";
import { hashPassword, verifyPassword } from "../utils/bcryptUtil.mjs";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ userType: { $ne: "Admin" } })
      .select("-password") //removed the password from result and excluded Admin userType
      .populate([
        { path: "preferredVeggies.vegetable" },
        { path: "nearestMarket.market" },
      ]);
    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: allUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id)
      .select("-password")
      .populate([
        { path: "preferredVeggies.vegetable" },
        { path: "nearestMarket.market" },
      ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUserPreferences = async (req, res) => {
  const { id } = req.params;
  const { preferredVeggies } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }
  try {
    const isIdFound = await User.findById(id);

    if (!isIdFound) {
      return res.status(404).json({ success: false, message: "Not Found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { preferredVeggies } },
      {
        new: true,
      }
    )
      .select("-password")
      .populate([
        { path: "preferredVeggies.vegetable" },
        { path: "nearestMarket.market" },
      ]);

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserDistribution = async (req, res) => {
  try {
    const userCounts = await User.aggregate([
      { $match: { userType: { $ne: "Admin" } } }, //exclude admin
      {
        $group: {
          _id: "$nearestMarket.market", //group by market
          count: { $sum: 1 }, //get the count
        },
      },
    ]);

    const allMarkets = await Market.find({}); //get all markets

    const result = allMarkets.map((market) => {
      const hasACount = userCounts.find(
        //check all markets have any count
        (entry) => entry._id.toString() === market._id.toString()
      );

      return {
        market: market.market,
        count: hasACount ? hasACount.count : 0,
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getPreferredVeggieCount = async (req, res) => {
  try {
    const veggieCount = await User.aggregate([
      { $match: { userType: { $ne: "Admin" } } },
      { $unwind: "$preferredVeggies" },
      {
        $group: {
          _id: "$preferredVeggies.vegetable",
          count: { $sum: 1 },
        },
      },
    ]);

    const allVeggies = await Vegetable.find({}); //get all veggies

    const result = allVeggies.map((vegetable) => {
      const hasACount = veggieCount.find(
        //check all veggies have any count
        (entry) => entry._id.toString() === vegetable._id.toString()
      );

      return {
        vegetable: vegetable.vegetableName,
        count: hasACount ? hasACount.count : 0,
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const userFound = await User.findOne({ email }).select("_id"); //finding the user by email

    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: "No user found with submitted Email",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); //building a 6 digit random number as OTP;

    const token = jwt.sign(
      //generating a token with users id and generated OTP
      { id: userFound._id, otp: otp },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.cookie("OTPToken", token, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 300000,
    });

    const emailSent = await sendEmail(
      //sending the email
      email,
      "Password Reset OTP",
      `This is your one time password for reset password reset : ${otp}. This OTP is only valid for 5 minutes`
    );

    if (!emailSent) {
      console.error("Failed to send email");
      return res
        .status(500)
        .json({ success: false, message: "Failed to send email" });
    }

    res.status(200).json({
      success: true,
      data: { id: userFound._id },
      message: "OTP sent to the provided email",
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const token = req.cookies.OTPToken;

  if (!token) {
    return res.status(404).json({ success: false, message: "Token not found" });
  }

  try {
    const decodedOTPToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedOTPToken.otp !== otp) {
      return res.status(404).json({ success: false, message: "Invalid OTP" });
    }

    res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const ResetPasswordAfterVerified = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }
  try {
    const userFound = await User.findById(id);

    if (!userFound) {
      return res
        .status(404)
        .json({ success: false, message: "user Not Found" });
    }
    const hashedPassword = await hashPassword(password);

    userFound.password = hashedPassword;
    await userFound.save();

    res
      .status(200)
      .json({ success: true, message: "Password Changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const changePassword = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }
  try {
    const { password, newPassword } = req.body;
    const userFound = await User.findById(id);

    if (!userFound) {
      return res
        .status(404)
        .json({ success: false, message: "user Not Found" });
    }

    const isPasswordValid = await verifyPassword(password, userFound.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Current Password is Invalid" });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    userFound.password = hashedNewPassword;
    await userFound.save();
    res
      .status(200)
      .json({ success: true, message: "Password Changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteAccount = async (req, res) => { 
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const userFound = await User.findById(id);

    if (!userFound) {
      return res
        .status(404)
        .json({ success: false, message: "user Not Found" });
    }

    await User.findByIdAndDelete(id);
     res
       .status(200)
       .json({ success: true, message: "User Account has been deleted successfully" });
  } catch (error) {
     res.status(500).json({
       success: false,
       message: "Internal Server Error",
     });
  }
}
