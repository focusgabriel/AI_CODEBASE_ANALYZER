import mongoose from "mongoose";
const analysisReportSchema = new mongoose.Schema(
  {
    required: [
      "summary",
      "scores",
      "architecture",
      "codeQuality",
      "technologies",
      "security",
      "recommendations",
      "risks",
    ],

    scores: {
      architecture: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      codeQuality: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      technologies: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      security: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      overall: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },

      required: [
        "architecture",
        "codeQuality",
        "technologies",
        "security",
      ],
    },

    analysisId: {
      type: String,
      required: true,
      unique: true,
      ref: "Analysis",
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