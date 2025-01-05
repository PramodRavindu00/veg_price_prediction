import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    unique: true,
  },
  contactNo: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  nearestMarket: {
    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Market",
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  notification: {
    type: Boolean,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  preferredVeggies: [
    {
      vegetable: { type: mongoose.Schema.Types.ObjectId, ref: "Vegetable" },
      amount: { type: Number },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

export default User;
