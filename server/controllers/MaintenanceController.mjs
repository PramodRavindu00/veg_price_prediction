import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Vegetable from "../models/vegetableModel.mjs";
import Market from "../models/MarketModel.mjs";
import User from "../models/UserModel.mjs";
import Query from "../models/QueryModel.mjs";
import axios from "axios";

const filePath = fileURLToPath(import.meta.url);
const textFilePath = path.join(
  path.dirname(filePath),
  "../data",
  "current_fuel_price.txt"
);

export const updateFuelPrice = async (req, res) => {
  const { fuelPrice } = req.body;
  try {
    await writeFile(textFilePath, fuelPrice.toString(), "utf-8");
    console.log("Written to File");
    res.status(200).json({ success: true, message: "Written to the file" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getFuelPrice = async (req, res) => {
  try {
    const price = await readFile(textFilePath, "utf-8");
    res.status(200).json({ success: true, price: Number(price).toFixed(2) });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCounts = async (req, res) => {
  try {
    const vegCount = await Vegetable.countDocuments();
    const marketCount = await Market.countDocuments();
    const userCount = await User.countDocuments({ userType: { $ne: "Admin" } }); //excluding admin
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

export const getWeatherData = async (req, res) => {
  const { location } = req.params;
  try {
    const response = await axios.get(
      `http://api.worldweatheronline.com/premium/v1/weather.ashx?q=${location},sri+lanka&num_of_days=8&tp=24&format=json&key=${process.env.WEATHER_API_KEY}`
    );

    const dailyData = response.data.data.weather;

    const totalRainfall = dailyData.reduce((sum, singleDay) => {
      const dailyRainfall = singleDay.hourly.reduce(
        (daySum, item) => daySum + parseFloat(item.precipMM),
        0
      );
      return sum + dailyRainfall;
    }, 0);

    const avgRainfall = parseFloat(
      (totalRainfall / dailyData.length).toFixed(2)
    );

    const avgTemp =
      dailyData.reduce((sum, item) => sum + parseFloat(item.avgtempC), 0) /
      dailyData.length;

    const nextWeekAvg = {
      avgTemp: avgTemp,
      avgRainfall: avgRainfall,
    };

    // const nextWeekAvg = {
    //   avgTemp: 10,
    //   avgRainfall: 0.45,
    // };

    res.status(200).json({ success: true, data: nextWeekAvg });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
