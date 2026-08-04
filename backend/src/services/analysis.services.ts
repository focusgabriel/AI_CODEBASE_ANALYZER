// import { randomUUID } from "node:crypto";
// import { CreateAnalysisRequestDto } from "../dtos/analysis.dto.js";
// import { AnalysisStatus, SourceType } from "../enum/analysis.dto.js";
// import { analysisRepository } from "../repositories/analysis.repository.js";

import { randomUUID } from "node:crypto";
import {
  CreateAnalysisDto,
  CreateAnalysisRequestDto,
  CreateAnalysisResponseDto,
} from "../dtos/analysis.dto.js";
import { AnalysisStatus, SourceType } from "../enum/analysis.dto.js";
import { createAnalysisRecord } from "../repositories/analysis.repository.js";
const analysisId = randomUUID();

// export class AnalysisService {
//   async createAnalysis(request: CreateAnalysisRequestDto) {

//     const dto = {
//       userId: request.userId,
//       name: request.name,
//       status: AnalysisStatus.PENDING,
//       sourceType: SourceType.ZIP,
//       sourceLocation: `/storage${analysisId}/source`,
//     };

//     const analysis = await analysisRepository.create(dto);

//     return {
//       analysisId: analysis._id.toString(),
//       status: analysis.status,
//     };
//   }
// }

// export const analysisService = new AnalysisService();

export async function createAnalysis(
  request: CreateAnalysisRequestDto,
): Promise<CreateAnalysisResponseDto> {
  const dto: CreateAnalysisDto = {
    userId: request.userId,
    name: request.name,
    status: AnalysisStatus.PENDING,
    sourceType: SourceType.ZIP,
    sourceLocation: `/storage${analysisId}/source`,
  };

  const analysis = await createAnalysisRecord(dto);

  return {
    analysisId: analysis._id.toString(),
    status: analysis.status as AnalysisStatus.PENDING,
  };
}
