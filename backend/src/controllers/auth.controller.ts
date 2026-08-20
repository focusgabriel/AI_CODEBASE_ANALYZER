import { NextFunction, Request, Response } from "express";
import { getCurrentUser, LoginToAccount, RefreshTokenCreate, RegisterNewAccount, RevokeRefreshToken } from "../services/auth.services.js";
import crypto from "crypto";
import bcrypt  from "bcrypt"
// import { sendVerificationEmail } from "../utils/emailSender/verificationEmail.js";
import { AppError } from "../core/errors/AppError.js";
import { ACCESS_TOKEN_MAX_AGE_MS, generateAccessToken, generateRefreshToken, REFRESH_TOKEN_MAX_AGE_MS, verifyRefreshToken } from "../utils/jwt.js";
import { env } from "../core/config/env.js";

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
    
    // const verifiedToken = crypto.randomBytes(32).toString("hex");
    // const hashedToken = crypto.createHash("sha256").update(verifiedToken).digest("hex");
    // const expireToken = new Date(Date.now() + 1000 * 60 * 60  );//1 hour

    // const user = await RegisterNewAccount({name, email, password:hashedPassword, verificationToken:hashedToken, verificationTokenExpires:expireToken})

    await RegisterNewAccount({name, email, password:hashedPassword})

    // const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verifiedToken}`;

    // await sendVerificationEmail(user.email, verificationUrl, user.name);
    
    // return res.status(201).json(
    //   {
    //     success:true,
    //     msg: "Registration successful. Please check your email to verify your account."}
    // );
    return res.status(201).json(
      {
        success:true,
        msg: "Registration successful, you can login in now"}
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
