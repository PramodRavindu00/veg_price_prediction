import { isValidObjectId } from "mongoose";
import User from "../models/UserModel.mjs";
import Market from "../models/MarketModel.mjs";

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
          _id: "$nearestMarket.market",   //group by market
          count: { $sum: 1 },             //get the count
        },
      },
    ]);

    const allMarkets = await Market.find({});    //get all markets

    const result = allMarkets.map((market) => {   
      const hasACount = userCounts.find(        //check all markets have any count
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
