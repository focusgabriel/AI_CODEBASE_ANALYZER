// import mongoose from "mongoose";

// export interface ReportDocument {
//   analysisId: string;
//   content: string;
// }

// const reportSchema = new mongoose.Schema(
//   {
//     analysisId: {
//         type: String,
//         required: true,
//         unique: true,
//         ref: "Analysis",
//     },

//     content: {
//         type: String,
//         required: true,
//     },
//   },
//   {
//       timestamps: true,
//   },
// );

// export const ReportModel = mongoose.model(
//   "Report",
//   reportSchema,
// );