import mongoose from "mongoose";
import { AnalysisStatus } from "../enum/analysis.dto.js";

export interface FileDocument {
  analysisId: mongoose.Types.ObjectId;
  path: string;
  extension: string;
  language: string;
  size: number;
  status: string;
}

export const FileModel = mongoose.model(
  "File",
  new mongoose.Schema<FileDocument>(
    {
      analysisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Analysis",
        required: true,
      },

      path: {
        type: String,
        required: true,
      },

      extension: {
        type: String,
        default: null,
      },

      language: {
        type: String,
        default: "UNKNOWN",
      },

      size: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        default: AnalysisStatus.PENDING,
      },
    },
    {
      timestamps: true,
    },
  ),
);
