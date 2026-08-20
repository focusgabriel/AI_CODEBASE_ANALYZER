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
    { returnDocument: "after"},
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

// const hashedToken = crypto
// export const tokenHashed = (Token:string) => {
  
//   hashedToken
//     .createHash("sha256")
//     .update(Token)
//     .digest("hex");

//     return hashedToken;
// }
export async function getVerification(
  verificationToken: string,
) {
  const get_verification = authModel.findOne({
    verificationToken,
    verificationTokenExpires: {
      $gt: new Date()
    }
  });

  return get_verification
}

export async function getEmailforEmailReset(
  email: string
) {
  return authModel.findOne({ email });
}

export async function getResetPassword(
  passwordResetToken: string,
) {
  return authModel.findOne({
    passwordResetToken,
    passwordResetExpires: {
      $gt: new Date()
    }
  })
}