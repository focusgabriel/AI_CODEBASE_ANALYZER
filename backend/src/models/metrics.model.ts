import mongoose from "mongoose";

export interface MetricsDocument {
  analysisId: string;
  fileId: string;

  imports: number
  exports: number
  functions: number
  classes: number
  interfaces: number
}

const metricsSchema = new mongoose.Schema({
  analysisId: {
    type: String,
    required: true,
    ref: "Analysis",
  },

  fileId: {
    type: String,
    required: true,
    ref: "Files",
  },

  imports: Number,
  exports: Number,
  functions: Number,
  classes: Number,
  interfaces: Number,
  // types: Number,

},
  {
    timestamps: true,
  }
)

export const MetricsModel = mongoose.model(
  "Metrics", metricsSchema
);