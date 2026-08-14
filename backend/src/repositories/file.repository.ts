import mongoose from "mongoose";
import { CreateFileDto } from "../dtos/file.dto.js";
import { FileModel } from "../models/file.model.js";

export async function createFiles(files: CreateFileDto[]) {
  return FileModel.insertMany(files);
}

export async function getFilesByAnalysisId(
  analysisId: mongoose.Types.ObjectId,
) {
  console.log("🔎 GET FILES FOR ANALYSIS:", analysisId);
  const files = await FileModel.find({ analysisId });
  console.log("=========================== Files Length ==============================")
  console.log("🔎 FILE RECORDS FOUND:", files.length);

  return files;
}


export async function deleteFilesByAnalysisId(
  analysisId: mongoose.Types.ObjectId,
) {
  return FileModel.deleteMany({ analysisId });
}

// export async function getFilesByAnalysisId(
//   analysisId: mongoose.Types.ObjectId,
// ) {
//   return FileModel.findOne({analysisId});
// }


export async function getFilesByUserId(
  userId: mongoose.Types.ObjectId,
) {
  return await FileModel.aggregate([
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

        path: 1,
        extension: 1,
        language: 1,
        size: 1,
        status: 1,

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


// export async function getFilesByAnalysisId(
//   analysisId: string,
// ) {
//   console.log("🔎 GET FILES FOR ANALYSIS:", analysisId);

//   const files = await FileModel.find({
//     analysisId,
//   });

//   console.log("🔎 FILE RECORDS FOUND:", files.length);

//   return files;
// }