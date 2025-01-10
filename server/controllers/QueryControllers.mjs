import mongoose, { isValidObjectId } from "mongoose";
import Query from "../models/QueryModel.mjs";
import { sendEmail } from "../utils/emailService.mjs";

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
  const { emailToSend, reply, replyDate } = req.body;

  if (!isValidObjectId(id)) {
    //checking URL passing a valid object ID
    return res
      .status(400)
      .json({ success: false, message: "Invalid Query ID" });
  }

  const isIdFound = await Query.findById(id); //check valid ID
  if (!isIdFound) {
    return res.status(404).json({ success: false, message: "Not Found" });
  }

  const session = await mongoose.startSession();
  session.startTransaction(); //starting session and transaction

  try {
    await Query.findByIdAndUpdate(id, {
      //updating database with reply
      $set: { reply: reply, replyDate: replyDate },
    });

    const emailSent = await sendEmail(
      //sending the email
      emailToSend,
      "Reply To Your Message",
      reply
    );

    if (!emailSent) {
      //if email sending fails, whole transaction abort and return error response
      await session.abortTransaction();
      console.error("Failed to send email");
      return res
        .status(500)
        .json({ success: false, message: "Failed to send email" });
    }

    await session.commitTransaction(); //else execute the whole transaction

    res.status(200).json({ success: true, message: "Reply submitted" });
  } catch (error) {
    await session.abortTransaction(); //if any other error occurs , abort the whole transaction
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    session.endSession(); //finally end the session
  }
};
