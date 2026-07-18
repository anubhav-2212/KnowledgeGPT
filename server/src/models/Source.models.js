import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    knowledgeBaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KnowledgeBase",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["pdf", "website", "text"],
      required: true,
    },

    sourceName: {
      type: String,
      required: true,
    },

    sourceUrl: {
      type: String,
    },

    extractedText: {
      type: String,
      default: "",
    },

   status: {
    type: String,
    enum: [
        "processing",
        "embedding",
        "ready",
        "failed"
    ],
    default: "processing",
},

// ------------------ chunks ------------------
   chunkIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Chunk",
    default: []
  },

  vectorStoreId: {
    type: String,
    default: ""
  },

  totalChunks: {
    type: Number,
    default: 0
  },

  chunkSize: {
    type: Number,
    default: 1000
  },

  chunkOverlap: {
    type: Number,
    default: 150
  },
},
  {
    timestamps: true,
  }
);

const Source = mongoose.model(
  "Source",
  sourceSchema
);
export default Source;
