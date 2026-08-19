import { NextFunction, Request, Response } from "express";
import { getCurrentUser, LoginToAccount, RefreshTokenCreate, RegisterNewAccount } from "../services/auth.services.js";
import crypto from "crypto"
import bcrypt  from "bcrypt"
// import { sendVerificationEmail } from "../utils/emailSender/verificationEmail.js";
import { AppError } from "../core/errors/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

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

    const user = await RegisterNewAccount({name, email, password:hashedPassword})

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

    console.log(user);

    if(!user){
      throw new AppError("Invalid Credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      throw new AppError("Invalid Credentials", 400);
    }

    // console.log("User:", user._id.toString())

    const accessToken = generateAccessToken( user._id.toString() );
    const refreshToken = generateRefreshToken( user._id.toString() );
    user.refreshToken = refreshToken;
    await user.save();
    
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
      path: "/",
    };


    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      // maxAge:  15 * 60 * 1000,
      maxAge:  7 * 24 * 60 * 60 * 1000,
    });


    res.cookie("refreshToken", user.refreshToken, {
      ...cookieOptions,
      maxAge:  7 * 24 * 60 * 60 * 1000,
    });

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
      throw new AppError("Refresh Token is required.", 400)
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { sub: string };

    if(typeof decoded === "string" || !("sub" in decoded)){
      throw new AppError("Invalid token", 400);
    }

    const user = await RefreshTokenCreate(decoded.sub, refreshToken);
    if (!user) {
      throw new AppError("Invalid refresh token", 400);
    }
    // Generate a new access token
    const accessToken = generateAccessToken(user._id.toString());

    // Generate a new refresh token
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
      path: "/",
    };

    await user.save();
    // Return it
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      // maxAge:  15 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
      path: "/",
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
