import mongoose from "mongoose";
import { AnalysisStatus, SourceType } from "./analysis.types.js";

interface AnalysisSchema {
  userId: mongoose.Types.ObjectId,
  name: string,
  status: string,
  sourceType: string,
  sourceLocation: string,
  reportId: mongoose.Types.ObjectId,
  startedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}

const analysisSchema = new mongoose.Schema<AnalysisSchema>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },

  name: {
    type: String,
    trim: true,
    required: true,
  },

  status: {
    enum: Object.values(AnalysisStatus),
    default: AnalysisStatus.PENDING
  },

  sourceType: {
    enum: Object.values(SourceType)
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
    timestamps: true
  }

)

export const AnalysisModel = mongoose.model(
  "Analysis", analysisSchema
)