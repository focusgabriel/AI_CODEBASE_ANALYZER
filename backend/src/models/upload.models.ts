import mongoose from "mongoose";

export interface UploadDocument {
  analysisId: mongoose.Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  extractedPath: string;
}

export const UploadSchema = new mongoose.Schema<UploadDocument>(
  {
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
      required: true,
    },

    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },

    storedFileName: {
      type: String,
      required: true,
      trim: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    extractedPath: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

export const UploadModel = mongoose.model("Uploads", UploadSchema);
