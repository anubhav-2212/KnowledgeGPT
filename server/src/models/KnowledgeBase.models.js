import mongoose from "mongoose";

const knowledgeBaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

export const KnowledgeBase =
  mongoose.model(
    "KnowledgeBase",
    knowledgeBaseSchema
  );