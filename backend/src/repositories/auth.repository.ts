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

export async function rotateRefreshToken(
  userId: string,
  currentRefreshTokenHash: string,
  nextRefreshTokenHash: string,
) {
  return authModel.findOneAndUpdate(
    { _id: userId, refreshToken: currentRefreshTokenHash },
    { $set: { refreshToken: nextRefreshTokenHash } },
    { new: true },
  );
}

export async function revokeRefreshToken(refreshTokenHash: string) {
  return authModel.updateOne(
    { refreshToken: refreshTokenHash },
    { $set: { refreshToken: null } },
  );
}

export async function getUser(userId:string){
  return authModel.findById(userId);
}
