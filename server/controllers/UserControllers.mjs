import { isValidObjectId } from "mongoose";
import User from "../models/UserModel.mjs";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ userType: { $ne: "Admin" } })
      .select("-password")
      .populate("nearestMarket.market"); //removed the password from result and excluded Admin userType
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
