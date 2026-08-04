// import { NextFunction, Request, Response } from "express";
// import { analysisService } from "../services/analysis.services.js";

// export class AnalysisController {
//   async createAnalysis(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { userId, name } = req.body as { userId: string; name: string };

//       const analysis = await analysisService.createAnalysis({
//         userId,
//         name,
//       });

//       return res.status(201).json({
//         success: true,
//         data: analysis,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

import { Request, Response, NextFunction } from "express";
import { createAnalysis } from "../services/analysis.services.js";

export const createAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, name } = req.body;

    const analysis = await createAnalysis({
      userId,
      name,
    });

    return res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};
