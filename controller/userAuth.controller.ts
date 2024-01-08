import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcryptJs from "bcryptjs";
import createJWT from "../config/jsonwebtoken";
import { accessToken, refeshToken } from "../secret/secret";

interface ILogin {
  email: string;
  password: string;
}
export const LogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as ILogin;
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      throw createError(404, "Please create an account, then try");
    }
    if(user?.password !== undefined){
    const comparePassword = await bcryptJs.compare(password, user.password);

    if (!comparePassword) {
      throw createError(404, "Password not matched");
    }
  }
    const accesskey = createJWT({ user }, "5m", accessToken);
    const refreshKey = createJWT({ user }, "7d", refeshToken);
    res.cookie("access_token", accesskey, {
      expires: new Date(Date.now() + 5 * 60 * 1000), // 5min
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refresh_token", refreshKey, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7day
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "LogIn successful",
      user,
      accesskey,
    });
  } catch (error: any) {
    next(createError(500, error));
  }
};

export const logOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({
      success: true,
      message: "Logout Successfull",
    });
  } catch (error: any) {
    next(createError(500, error));
  }
};

export const socialAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, socialAvatar } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      const accesskey = createJWT({ user }, "5m", accessToken);
      const refreshKey = createJWT({ user }, "7d", refeshToken);
      res.cookie("access_token", accesskey, {
        expires: new Date(Date.now() + 5 * 60 * 1000), // 5min
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refresh_token", refreshKey, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7day
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(201).json({
        success: true,
        message: "User Login successfully",
        user,
         accesskey
      });
    } else {
      user = await User.create({
        name: name,
        email: email,
        socialAvatar: socialAvatar,
      });
      const accesskey = createJWT({ user }, "5m", accessToken);
      const refreshKey = createJWT({ user }, "7d", refeshToken);
      res.cookie("access_token", accesskey, {
        expires: new Date(Date.now() + 5 * 60 * 1000), // 5min
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refresh_token", refreshKey, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7day
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(201).json({
        success: true,
        message: "User Login successfully",
        user,
        accesskey
      });
    }
   
  } catch (error: any) {
    next(createError(500, error));
  }
};

export const updateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refresh_token } = req.cookies;

    const decoded = jwt.verify(refresh_token, refeshToken) as JwtPayload;

    if (!decoded) {
      throw createError(404, "Please Login");
    }
    const user = decoded.user;
    const accessKey = createJWT({user}, "5m", accessToken);

    res.cookie("access_token", accessKey, {
      expires: new Date(Date.now() + 5 * 60 * 1000),
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    req.user = decoded.user;
    next();
  } catch (error: any) {
    next(createError(500, error));
  }
};
