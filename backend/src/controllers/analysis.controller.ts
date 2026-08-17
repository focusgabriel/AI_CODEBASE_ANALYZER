import { Request, Response, NextFunction } from "express";
import { createAnalysis, deleteAnalysis, getAllAnalysisForUser, getAnalysisCount, getAnalysisForUser, getScoreTrend, renameAnalysis } from "../services/analysis.services.js";
import { AppError } from "../core/errors/AppError.js";

export const createAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const { name } = req.body;

    const userId = req.user!.id;
    

    const analysis = await createAnalysis({
      userId,
      // name,
    });

    return res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserAnalysisController = async (
  req:Request,
  res:Response,
  next:NextFunction
) => {
  try {
    const {analysisId } = req.params
    const userId = req.user!.id

    if(!analysisId || !userId) {
      throw new AppError("Analysis ID and user ID are required", 400);
    }

    const analysis = await getAnalysisForUser(analysisId as string, userId as string);
    if (!analysis) {
      return next(
        new AppError("Analysis not found", 404),
      );
    }

    return res.status(200).json({
      success:true,
      data: {
        name: analysis.name,
        status: analysis.status,
        sourceType: analysis.sourceType,
        sourceLocation: analysis.sourceLocation,
        reportId: analysis.reportId,
        startedAt: analysis.startedAt,
        completedAt: analysis.completedAt,
        createdAt: analysis.createdAt,
      }

    })
  } catch (error) {
    next(error);
  }
}

export async function getAllAnalysisForUserController(
  req:Request,
  res:Response,
  next:NextFunction
) {
  
  const { page, limit, name, status, search, sort,order } = req.query;
  // const user = req.user!.id

  const filter:any = {
    userId: req.user!.id
  }

  if(!filter) {
    throw new AppError("UnAuthorized", 404);
  }

  if(name) {
    filter.name = name
  }

  if(status) {
    filter.status = status
  }

  if(search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i"
        }
      }, 

      {
        status: {
          $regex: search,
          $options: "i",
        }
      }
    ]
  };

  const sortOption: Record<string, 1 | -1> = {
    createdAt: -1
  }

  if(sort) {
    sortOption[sort as string] = order === "asc" ? 1 : -1;
  }

  const requestedPage = Number(page);
  const requestedLimit = Number(limit);
  const limitNumber = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.floor(requestedLimit), 1), 100)
    : 10;
  const total = await getAnalysisCount(filter);
  const totalPages = Math.max(Math.ceil(total / limitNumber), 1);
  const pageNumber = Number.isFinite(requestedPage)
    ? Math.min(Math.max(Math.floor(requestedPage), 1), totalPages)
    : 1;

  const skip = (pageNumber - 1) * limitNumber;
  
  const getAnalysis = await getAllAnalysisForUser(
    filter,
    sortOption,
    skip,
    limitNumber
  )

  return res.status(200).json({
    success: true,
    getAnalysis,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalLimit: totalPages
    }
  })
}

export async function deleteAnalysisController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { analysisId } = req.params;
    const userId = req.user!.id;

    if (!analysisId) {
      throw new AppError("Analysis ID is required", 400);
    }

    const deleted = await deleteAnalysis(analysisId as string, userId);

    return res.status(200).json({
      success: true,
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
}

export async function renameAnalysisController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { analysisId } = req.params;
    const userId = req.user!.id;
    const { name } = req.body;

    if (!analysisId) {
      throw new AppError("Analysis ID is required", 400);
    }

    const updated = await renameAnalysis(analysisId as string, userId, name);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}




export async function getScoreTrendController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;

    const scoreTrend =
      await getScoreTrend(userId);

    return res.status(200).json({
      success: true,
      data: scoreTrend,
    });
  } catch (error) {
    next(error);
  }
}
