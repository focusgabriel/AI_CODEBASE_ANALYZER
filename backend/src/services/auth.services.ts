import { AppError } from "../core/errors/AppError.js";
import { UserDtoRespone, VerificatioDto } from "../dtos/auth.dto.js";
import { getEmailforEmailReset, getResetPassword, getUser, getVerification, LoginAccont, RegisterAccount, revokeRefreshToken, rotateRefreshToken } from "../repositories/auth.repository.js";

interface CreateUser {
  name: string,
  email: string,
  password: string,
  verificationToken: string,
  verificationTokenExpires: Date
}

export async function RegisterNewAccount(
  request: CreateUser
):Promise<UserDtoRespone>{
  const register = await RegisterAccount(request);

  return {
    userId: register._id.toString(),
    name: register.name,
    email: register.email,
    password: register.password,
    verificationToken: register.verificationToken,
    verificationTokenExpires: register.verificationTokenExpires,
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


  console.log("services refreshtoken create:", user);

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


export async function verifyAccount(
  verificationToken: string
): Promise<VerificatioDto> {
  const verify = await getVerification(verificationToken);

  if(!verify) {
    throw new AppError("Verification token is invalid or has expired", 400);
  }

  return {
    verificationToken
  }
}


export async function forgotPassword(
  email: string
) {

  const user = await getEmailforEmailReset(email);

  return user;
}

export async function ResetPassword(
  passwordResetToken: string
) {
  
  const token = await getResetPassword(passwordResetToken);

  return token;
}