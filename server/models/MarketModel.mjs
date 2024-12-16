import mongoose from "mongoose";

const MarketsSchema = new mongoose.Schema({
  market: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const Market = mongoose.model("Market", MarketsSchema);

export default Market;
