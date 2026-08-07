// import { CreateAnalysisDto } from "../dtos/analysis.dto.js";
// import { AnalysisModel } from "../models/analysis.models.js";

// export class AnalysisRepository {
//   async create(data: CreateAnalysisDto) {
//     return await AnalysisModel.create(data);
//   }
// }

// export const analysisRepository = new AnalysisRepository();

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