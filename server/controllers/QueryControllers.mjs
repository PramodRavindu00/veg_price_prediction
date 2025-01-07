import Query from "../models/QueryModel.mjs";

export const submitQuery = async (req, res) => {
  const QueryData = Query(req.body);
  try {
    await QueryData.save();
    res.status(201).json({ success: true, message: "Query Submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const viewQueries = async (req, res) => {
  try {
    const data = await Query.find({});
    res.status(201).json({ success: true, data:data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
