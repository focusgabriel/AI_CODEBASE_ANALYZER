import { AppError } from "../core/errors/AppError.js";
import { UserDtoRespone } from "../dtos/auth.dto.js";
import { getUser, LoginAccont, RegisterAccount, revokeRefreshToken, rotateRefreshToken } from "../repositories/auth.repository.js";

interface CreateUser {
  name: string,
  email: string,
  password: string,
  // verificationToken: string,
  // verificationTokenExpires: Date
}

export async function RegisterNewAccount(
  request: CreateUser
):Promise<UserDtoRespone>{
  const register = await RegisterAccount(request);

  return {
    userId: register._id.toString(),
    name: register.name,
    email: register.email,
  }
}


export async function LoginToAccount(
  email: string
) {

  const user = await LoginAccont(email);

  if(!user) {
    throw new AppError("Invalid Credentials", 401);
  }
  
  return user;
}

export async function RefreshTokenCreate(
  userId: string,
  currentRefreshTokenHash: string,
  nextRefreshTokenHash: string,
) {
  const user = await rotateRefreshToken(userId, currentRefreshTokenHash, nextRefreshTokenHash);

  if (!user) {
    throw new AppError("Invalid refresh token", 401);
  }

  return user;
}

export async function RevokeRefreshToken(refreshTokenHash: string) {
  await revokeRefreshToken(refreshTokenHash);
}

export async function getCurrentUser(
  userId: string
) {
  const user = await getUser(userId);

  if(!user) {
    throw new AppError("Unauthorized", 404);
  }

  return user;

}
