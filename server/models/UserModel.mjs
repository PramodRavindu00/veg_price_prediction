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
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  nearestMarket: {
    type: String,
    required: true,
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
});

const User = mongoose.model("User", UserSchema);

export default User;
