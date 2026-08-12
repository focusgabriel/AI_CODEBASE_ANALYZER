import mongoose from "mongoose";

import { AnalysisModel } from "../models/analysis.models.js";
import { AnalysisStatus } from "../enum/analysis.dto.js";

export async function updateAnalysisStatus(
  objectId:mongoose.Types.ObjectId, newStatus:AnalysisStatus, reportId?:string
) {
  const updateStatus = AnalysisModel.findByIdAndUpdate( objectId, {status:newStatus, reportId}, {
    returnDocuent: "after",
    runValidators: true
  }, 
  )

  return updateStatus;
}