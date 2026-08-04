import mongoose from "mongoose";

export interface CreateFileDto {
  analysisId: mongoose.Types.ObjectId;
  path: string;
  extension: string;
  language: string;
  size: number;
  status: string;
}
