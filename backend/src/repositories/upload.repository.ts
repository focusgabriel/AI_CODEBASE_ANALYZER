import mongoose from "mongoose";
import { UploadRepositoryDto } from "../dtos/upload.dto.js";
import { UploadModel } from "../models/upload.models.js";

export async function createUploadRecord(data: UploadRepositoryDto) {
  return UploadModel.create(data);
}

export async function getUploadRecord(
  uploadId: mongoose.Types.ObjectId,
  analysisId: mongoose.Types.ObjectId,
) {
  return UploadModel.findOne({
    _id: uploadId,
    analysisId,
  })
}



// to get the user upload files from the analysisId because that is where the userId is, a single source of truth
export async function getUploadByUserId(
  userId: mongoose.Types.ObjectId,
) {
  return await UploadModel.aggregate([
    {
      $lookup: {
        from: "analyses",
        localField: "analysisId",
        foreignField: "_id",
        as: "analysis",
      },
    },

    {
      $unwind: "$analysis",
    },

    {
      $match: {
        "analysis.userId": userId,
      },
    },

    {
      $project: {
        _id: 1,
        analysisId: 1,

        originalFileName: 1,
        storedFileName: 1,
        filePath: 1,
        extractedPath: 1,

        createdAt: 1,
        updatedAt: 1,
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
}