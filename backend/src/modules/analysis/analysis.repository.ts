import { CreateAnalysisDto } from "./analysis.dto.js";
import { AnalysisModel } from "./analysis.model.js";

export class AnalysisRepository {
  async create(data: CreateAnalysisDto) {
    return await AnalysisModel.create(data);
  }
}

export const analysisRepository = new AnalysisRepository();