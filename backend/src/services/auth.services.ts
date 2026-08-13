import { AppError } from "../core/errors/AppError.js";
import { UserDto, UserDtoRespone } from "../dtos/auth.dto.js";
import { getUser, LoginAccont, RefreshTokenCreation, RegisterAccount } from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";

interface CreateUser {
  name: string,
  email: string,
  password: string,
  // verificationToken: string,
  // verificationTokenExpires: Date
}

interface LoginUser{
  email:string
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
  refreshToken: string
) {
  const user = await RefreshTokenCreation(userId, refreshToken);

  if (!user) {
    throw new AppError("User not found", 401);
  }

  return user;
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