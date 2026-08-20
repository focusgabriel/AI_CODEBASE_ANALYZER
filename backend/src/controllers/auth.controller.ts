import { NextFunction, Request, Response } from "express";
import { forgotPassword, getCurrentUser, LoginToAccount, RefreshTokenCreate, RegisterNewAccount, ResetPassword, RevokeRefreshToken } from "../services/auth.services.js";
import crypto from "crypto";
import bcrypt  from "bcrypt"
// import { sendVerificationEmail } from "../utils/emailSender/verificationEmail.js";
import { AppError } from "../core/errors/AppError.js";
import { ACCESS_TOKEN_MAX_AGE_MS, generateAccessToken, generateRefreshToken, REFRESH_TOKEN_MAX_AGE_MS, verifyRefreshToken } from "../utils/jwt.js";
import { env } from "../core/config/env.js";
import { getVerification } from "../repositories/auth.repository.js";
import { sendResetPasswordEmail } from "../utils/emailSender/passwordResetEmail.js";
import { sendVerificationEmail } from "../utils/emailSender/verificationEmail.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function hashRefreshToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function RegisterAccountController(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {
    const {name, email, password} = req.body

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const verifiedToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verifiedToken).digest("hex");
    const expireToken = new Date(Date.now() + 1000 * 60 * 60  );//1 hour

    const user = await RegisterNewAccount({name, email, password:hashedPassword, verificationToken:hashedToken, verificationTokenExpires:expireToken})

    // await RegisterNewAccount({name, email, password:hashedPassword, verif})

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verifiedToken}`;

    await sendVerificationEmail(user.email, verificationUrl, user.name);
    
    return res.status(201).json(
      {
        success:true,
        msg: "Registration successful. Please check your email to verify your account."}
    );    

  } catch (error) {
    next(error)
  }
}

export async function LoginAccountController(
  req: Request,
  res: Response,
  next: NextFunction
){
  try {
    // const token = req.cookies
    const {email, password} = req.body;

    const user = await LoginToAccount(email);

    if(!user){
      throw new AppError("Invalid Credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      throw new AppError("Invalid Credentials", 400);
    }

    // console.log("User:", user._id.toString())

    const accessToken = generateAccessToken( user._id.toString() );
    const newRefreshToken = generateRefreshToken( user._id.toString() );
    user.refreshToken = hashRefreshToken(newRefreshToken);
    await user.save();

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });


    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });

    console.log("access token:", accessToken);
    console.log("refresh token:", newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        email: user.email
      }
    })
  } catch (error) {
    next(error);
  }
}

export async function RefreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const { refreshToken } = req.body;
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
      throw new AppError("Refresh token is required", 401);
    }
    let decoded: ReturnType<typeof verifyRefreshToken>;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }

    if(typeof decoded === "string" || typeof decoded.sub !== "string" || !decoded.sub){
      throw new AppError("Invalid refresh token", 401);
    }

    const newRefreshToken = generateRefreshToken(decoded.sub);
    const user = await RefreshTokenCreate(
      decoded.sub,
      hashRefreshToken(refreshToken),
      hashRefreshToken(newRefreshToken),
    );
    const accessToken = generateAccessToken(user._id.toString());

    console.log("new access token", accessToken);
    
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });


    console.log('refresh token activated', refreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });

    return res.status(200).json({
      success: true,
      message: "Refresh token activated"
    });

  } catch (error) {
    next(error)
  }
}

export async function LogoutAccountController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RevokeRefreshToken(hashRefreshToken(refreshToken));
    }

    res.clearCookie("accessToken", {
      ...cookieOptions,
    });
    res.clearCookie("refreshToken", {
      ...cookieOptions,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getCurrentUser(req.user!.id)

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      }
    })

  } catch (error) {
    next(error);
  }
}


export async function verificationAccountController(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try{

    const { token } = req.params;

    if(typeof token !== " string" as string || token!.length === 0) {
      throw new AppError("Verification token is missing or invalid", 400);
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token as string)
      .digest("hex");
    
    const user = await getVerification(
      hashedToken
    )

    if(!user){
      throw new AppError(
        "Verification token is invalid or has expired.",
        400
      );
    }

    user.isVerified = true;

    user.verificationToken = undefined;

    user.verificationTokenExpires = undefined;


    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully."
    })


  } catch(err) {
    next(err);
  }
}


export async function forgotPasswordController(
  req:Request,
  res:Response,
  next: NextFunction
) {
  try {
    
    const { email } = req.body;

    const user = await forgotPassword(email);

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;

    user.passwordResetExpires = new Date(
      Date.now() + 1000 * 60 * 15
    );

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try{
      await sendResetPasswordEmail(user.email, resetUrl, user.name);
    } catch(error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      throw new AppError("Failed to send reset password email. Please try again later.", 500);
    }

    return res.status(200).json({
      status: true,
      message: "If an account with that email exists, a reset link has been sent."
    });


  } catch(error) {
    next(error);
  }
}


export async function ResetPasswordController(
  req:Request,
  res:Response,
  next:NextFunction
) {
  const { token } = req.params;
  const { password } = req.body;
  try {

    if(typeof token !== "string" || token?.length === 0) {
      throw new AppError("token is invalid.", 400);
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await ResetPassword(hashedToken);

    if(!user) {
      throw new AppError(
        "Reset token is invalid or has expired.",
        400
      );
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.passwordResetToken = undefined;

    user.passwordResetExpires = undefined;
    
    user.refreshToken = null;

    await user.save();

    return res.status(200).json({
      success:true,
      message: "Password reset successful.",
    });

  } catch(error) {
    next(error)
  }
}