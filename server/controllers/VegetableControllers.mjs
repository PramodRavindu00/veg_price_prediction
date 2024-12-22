import Vegetable from "../models/vegetableModel.mjs";

export const getAllVegetables = async (req, res) => {
  try {
    const allVegetables = await Vegetable.find({}).sort({ value: 1 });
    res.status(200).json({ success: true, data: allVegetables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
