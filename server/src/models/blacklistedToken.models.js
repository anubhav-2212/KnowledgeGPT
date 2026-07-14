import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // Token expires after 30 days
  }
});

export const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistedTokenSchema);