import Market from "../models/MarketModel.mjs";

export const getAllMarkets = async (req, res) => {
  try {
    const allMarkets = await Market.find({}).sort({ market: 1 });
    //console.log(allMarkets);
    res.status(200).json({ success: false, data: allMarkets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
