import mongoose from "mongoose";
import { UserDto } from "../dtos/auth.dto.js";
import { authModel } from "../models/auth.models.js";

export async function RegisterAccount(data: UserDto){
  return authModel.create(data)
}

export async function LoginAccont(email:string) {
  return authModel.findOne({
    email
  })
}

export async function RefreshTokenCreation(userId: string, refreshToken: string){
  return authModel.findOne({
    _id: new mongoose.Types.ObjectId(userId),
    refreshToken
  })
}

export async function getUser(userId:string){
  return authModel.findById(userId);
}