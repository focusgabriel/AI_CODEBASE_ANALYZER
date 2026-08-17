
import { AppError } from "../core/errors/AppError.js";
import { getAllAnalysisForUser, getAnalysisCount, getAnalysisForUser, getScoreTrend, getUserIdByAnalysis } from "../services/analysis.services.js";
import { getCurrentUser } from "../services/auth.services.js";
import { Request, Response, NextFunction } from "express";
import { getReportForUser } from "../services/report.services.js";
import { getAllAnalysisReport } from "../services/analysis-report-persistence.services.js";
import mongoose from "mongoose";
import { gettingMetricsByUser } from "../services/metrics.services.js";
import { gettingFilesByUser } from "../services/file.services.js";
import { getAllUploads } from "../services/upload.services.js";


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


    if (!mongoose.Types.ObjectId.isValid(user as string)) {
      return next(
        new AppError("Invalid analysis ID", 400),
      );
    }

    const UserId = new mongoose.Types.ObjectId(
      user as string
    );

    const getAnalysis = await getUserIdByAnalysis(user)

    if(!getAnalysis) {
      throw new AppError("Analysis not Found", 404);
    }

    // Getting All Report for the authenticated User
    const reports = await getAllAnalysisReport(UserId);

    if(!reports) {
      throw new AppError("Reports not Found", 404);
    }


    // Get All Metrics By the Authenticated User
    const metrics = await gettingMetricsByUser(UserId);

    // Get All Files By the Authenticated User --> this file i don't think i would evevn want to add it up here, i just need the size and language.
    const files = await gettingFilesByUser(UserId);

    // get all uploads by the authenticated user
    const uploads = await getAllUploads(UserId);

    const scoreTrend = await getScoreTrend(UserId.toString());

    return res.status(200).json({

    success: true,

    // getting the current user Endpoint.
    authUser: {
      name: currentUser.name,
      email: currentUser.email,
    },
    
    // Getting All Analysis for the authenticated User only.
    getAnalysis,

    // Getting All Report for the authenticated User
    reports,

    // Get All Metrics By the Authenticated User
    metrics,
    
    // Get All Files By the AUthenticated User.
    File: {
      size: files.map((file) => file.size),
      language: files.map((file) => file.language),
      extension: files.map((file) => file.extension),
    },

    // Get All Uploads By the AUthenticated User.
    Uploads: {
      originalFileName: uploads.map((upload) => upload.originalFileName),
      analysisId: uploads.map((upload) => upload.analysisId),
      uploadId: uploads.map((upload) => upload._id.toString()),
      created_at: uploads.map((upload) => upload.createdAt),
    },

    // the overall score for each analysis
    scoreTrend,

    })
  } catch (error) {
    next(error);
  }
}