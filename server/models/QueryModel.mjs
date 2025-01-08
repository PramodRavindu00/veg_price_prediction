import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: false,
  },
  replyDate: {
    type: Date,
    required: false,
  },
}, {timestamps:true});

const Query = mongoose.model("Query", QuerySchema);

export default Query;