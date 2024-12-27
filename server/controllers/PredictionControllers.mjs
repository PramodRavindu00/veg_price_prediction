import {
  multiVegSingleWeek,
  singleVegMultiWeek,
  singleVegSingleWeek,
} from "../utils/testData.mjs";

export const predictions = (req, res) => {
  const input = req.body;
  if (input.predType === "week") {
    return res.status(200).json({ success: true, data: singleVegSingleWeek });
  } else if (input.predType === "4week") {
    return res.status(200).json({ success: true, data: singleVegMultiWeek });
  }
};

export const multipleVegPredictions = (req, res) => {
  const input = req.body;
  res.status(200).json({ success: true, data: multiVegSingleWeek });
};
