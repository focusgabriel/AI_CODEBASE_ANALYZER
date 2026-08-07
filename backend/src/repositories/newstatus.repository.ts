import mongoose from "mongoose";
import { NewStatus } from "../dtos/analysis.dto.js";
import { AnalysisModel } from "../models/analysis.models.js";

export async function updateAnalysisStatus(
  objectId:mongoose.Types.ObjectId, newStatus:NewStatus, reportId?:string
) {
  const updateStatus = AnalysisModel.findByIdAndUpdate( objectId, {status:newStatus, reportId}, {
    returnDocuent: "after",
    runValidators: true
  }, 
  )

  return updateStatus;
}