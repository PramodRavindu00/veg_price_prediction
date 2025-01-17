import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Vegetable from "../models/vegetableModel.mjs";
import Market from "../models/MarketModel.mjs";
import User from "../models/UserModel.mjs";
import Query from "../models/QueryModel.mjs";

const filePath = fileURLToPath(import.meta.url);
const textFilePath = path.join(
  path.dirname(filePath),
  "../data",
  "current_fuel_price.txt"
);

export const updateFuelPrice = async (req, res) => {
  const { price } = req.body;
  try {
    await writeFile(textFilePath, price.toString(), "utf-8");
    console.log("Written to File");
    res.status(200).json({ success: true, message: "Written to the file" });
  } catch (error) {
    console.log(error.response.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getFuelPrice = async (req, res) => {
  try {
    const price = await readFile(textFilePath, "utf-8");
    res.status(200).json({ success: true, price: price });
  } catch (error) {
    console.log(error.response.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCounts = async (req, res) => {
  try {
    const vegCount = await Vegetable.countDocuments();
    const marketCount = await Market.countDocuments();
    const userCount = await User.countDocuments({ userType: { $ne: "Admin" } });  //excluding admin
    const queryCount = await Query.countDocuments();

    const counts = {
      vegCount: vegCount,
      marketCount: marketCount,
      userCount: userCount,
      queryCount: queryCount,
    };

    res.status(200).json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
