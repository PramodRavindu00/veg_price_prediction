import { isValidObjectId } from "mongoose";
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
    const data = await Query.find({}).sort({ createdAt: -1 });
    res.status(201).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const replyToQuery = async (req, res) => {
  const { id } = req.params;
  const  data  = req.body;
 
  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Query ID" });
  }
  try {
    
    const isIdFound = await Query.findById(id);
    if (!isIdFound) { return res.status(404).json({ success: false, message: "Not Found" }); }

    await Query.findByIdAndUpdate(id, {
      $set: { reply: data.reply, replyDate: data.replyDate },
    });

    res.status(200).json({ success: true, message: "Reply submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
