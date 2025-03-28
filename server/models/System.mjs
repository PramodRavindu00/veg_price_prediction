import mongoose from "mongoose";

const SystemSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  fuelPrice: {
    type: Number,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
});

const SystemDetails =
  mongoose.models.System_detail ||
  mongoose.model("System_detail", SystemSchema);

export default SystemDetails;
