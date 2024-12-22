import mongoose from "mongoose";

const VegetableSchema = new mongoose.Schema({
  vegetableName: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const Vegetable = mongoose.model("Vegetable", VegetableSchema);

export default Vegetable;