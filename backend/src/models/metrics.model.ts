import mongoose from "mongoose";

export interface MetricsDocument {
  analysisId: string;
  imports: number;
  exports: number;
  functions: number;
  classes: number;
  interfaces: number;
}

const metricsSchema = new mongoose.Schema<MetricsDocument>(
  {
    analysisId: {
      type: String,
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
  },
  {
    timestamps: true,
  },
);

export const MetricsModel = mongoose.model<MetricsDocument>(
  "Metrics",
  metricsSchema,
);