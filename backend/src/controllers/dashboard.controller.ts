
import { AppError } from "../core/errors/AppError.js";
import { getAllAnalysisForUser, getAnalysisForUser } from "../services/analysis.services.js";
import { getCurrentUser } from "../services/auth.services.js";
import { Request, Response, NextFunction } from "express";
import { getReportForUser } from "../services/report.services.js";
import { getAllAnalysisReport } from "../services/analysis-report-persistence.services.js";


export async function DashboardController(
  req:Request,
  res:Response,
  next:NextFunction
) {
  try {
    const user = req.user!.id
    const currentUser = await getCurrentUser(user);


    if(!user) {
      throw new AppError("UnAuthorized", 404);
    }

    const getAnalysis = await getAllAnalysisForUser(user);

    if(!getAnalysis) {
      throw new AppError("Analysis not Found", 404);
    }

    const reports = await getAllAnalysisReport(user);

    if(!reports) {
      throw new AppError("Reports not Found", 404);
    }

    return res.status(200).json({

    success: true,

    // getting the current user Endpoint.
    authUser: {
      id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
    },
    
    // Getting All Analysis for the authenticated User only.
    getAnalysis,


    // Getting All Report for the authenticated User
    reports
    
    })
  } catch (error) {
    next(error);
  }
}