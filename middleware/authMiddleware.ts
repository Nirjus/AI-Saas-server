import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { accessToken } from "../secret/secret";
import { updateAccessToken } from "../controller/userAuth.controller";

export const isLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { access_token } = req.cookies;

    if (!access_token) {
      try {
        await updateAccessToken(req, res, next);
      } catch (error: any) {
        next(createError(404, error));
      }
    } else {
      const isVerified = jwt.verify(access_token, accessToken) as JwtPayload;
      if (!isVerified) {
        throw createError(400, "user not verified");
      }
      req.user = isVerified.user;
      next();
    }
  } catch (error: any) {
    next(createError(500, error));
  }
};
