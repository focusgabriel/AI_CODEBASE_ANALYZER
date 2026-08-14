import mongoose from "mongoose";

export interface MetricsDocument {
  analysisId: mongoose.Types.ObjectId;

  imports: number;
  exports: number;
  functions: number;
  classes: number;
  interfaces: number;

  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
}

const metricsSchema = new mongoose.Schema<MetricsDocument>(
  {
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Analysis",
      unique: true,
      index: true,
    },

    imports: {
      type: Number,
      default: 0,
    },

    exports: {
      type: Number,
      default: 0,
    },

    functions: {
      type: Number,
      default: 0,
    },

    classes: {
      type: Number,
      default: 0,
    },

    interfaces: {
      type: Number,
      default: 0,
    },

    totalLines: {
      type: Number,
      default: 0,
    },

    codeLines: {
      type: Number,
      default: 0,
    },

    commentLines: {
      type: Number,
      default: 0,
    },

    blankLines: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const MetricsModel = mongoose.model<MetricsDocument>(
  "Metrics",
  metricsSchema,
);