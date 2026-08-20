import mongoose from "mongoose";
import { AnalysisReportDocument } from "../utils/analysis-report-pdf.js";
export const analysisReportSchema = new mongoose.Schema<AnalysisReportDocument>(
  {
    scores: {
      architecture: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      codeQuality: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      technologies: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      security: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      overall: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },

    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Analysis",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    architecture: {
      overview: {
        type: String,
        required: true,
      },

      patterns: {
        type: [String],
        default: [],
      },

      concerns: {
        type: [String],
        default: [],
      },
    },

    codeQuality: {
      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },
    },

    technologies: {
      strengths: {
        type: [String],
        default: [],
      },

      concerns: {
        type: [String],
        default: [],
      },


    },

    security: {
      findings: {
        type: [String],
        default: [],
      },

      recommendations: {
        type: [String],
        default: [],
      },


    },

    risks: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const AnalysisReportModel =
  mongoose.model(
    "AnalysisReport",
    analysisReportSchema,
  );