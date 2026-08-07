import mongoose from "mongoose";
import { AnalysisStatus, SourceType } from "../enum/analysis.dto.js";

interface AnalysisProps {
  userId: string;
  name: string;
  status: string;
  sourceType: string;
  sourceLocation: string;
  reportId: mongoose.Types.ObjectId | null;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const analysisSchema = new mongoose.Schema<AnalysisProps>(
  {
    userId: {
      type: String,
      ref: "Users",
      required: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(AnalysisStatus),
      default: AnalysisStatus.PENDING,
    },

    sourceType: {
      enum: Object.values(SourceType),
    },

    sourceLocation: {
      type: String,
      trim: true,
      required: true,
    },

    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

export const AnalysisModel = mongoose.model("Analysis", analysisSchema);
