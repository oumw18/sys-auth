import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: { type: String },
  expirationCode: { type: Date },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
