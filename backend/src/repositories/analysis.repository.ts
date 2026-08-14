

import mongoose from "mongoose";
import { CreateAnalysisDto } from "../dtos/analysis.dto.js";
import { AnalysisModel } from "../models/analysis.models.js";

export async function createAnalysisRecord(data: CreateAnalysisDto) {
  return AnalysisModel.create(data);
}

export async function findAnalysisForUser(
  analysisId: string,
  userId: string,
) {
  return AnalysisModel.findOne({
    _id: analysisId,
    userId,
  })
}

export async function findUserAnalysis(
  userId: string
) {
  return AnalysisModel.find({
    userId
  })
}


export async function findAnalysisById(
  analysisId: mongoose.Types.ObjectId,
  repositoryName: string,
  statusUpdate: string
) {
  return await AnalysisModel.findByIdAndUpdate(
  analysisId,
  {
    $set: {
      name: repositoryName,
      status: statusUpdate,
    },
  },
  {
    new: true,
  },
);
}