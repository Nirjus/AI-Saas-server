import { Request, Response, NextFunction } from "express";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import createError from "http-errors";
import { User } from "../model/user.Model";
import createJWT from "../config/jsonwebtoken";
import { frontendUrl, jwtActivationKey } from "../secret/secret";
import { senEmail } from "../helper/sendEmail";

interface IregestrationBody {
  name: string;
  email: string;
  password: string;
}
export const userRegistartion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body as IregestrationBody;

    if (!name) {
      throw new Error("Name is required");
    }
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    const user = await User.exists({ email: email });

    if (user) {
      throw createError(500, "User already have");
    }

    const JwtToken = createJWT(
      { name, email, password },
      "5m",
      jwtActivationKey
    );

    try {
      await senEmail({
        email: email,
        subject: "Account Activation Email",
        html: `
                <h1>Hey ${name},</h1>
                <h3>Please click this link for account activation.</h3>
                <a href="${frontendUrl}/accountActivation/${JwtToken}" target="_blank">Activate Account</a>
            `,
      });
    } catch (error) {
      console.log("Error in sending email", error);
    }
    res.status(200).json({
      success: true,
      message: `Please visit your ${email} for account activation`,
      token: JwtToken,
    });
  } catch (error: any) {
    next(createError(500, error));
  }
};

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const decoded = jsonwebtoken.verify(token, jwtActivationKey) as JwtPayload;

    if (!decoded) {
      throw createError(400, "Invalid Token");
    }
    const user = await User.exists({ email: decoded.email });

    if (user) {
      throw createError(400, "user already have");
    }

    await User.create(decoded);

    res.status(201).json({
      success: true,
      message: `${decoded.name} your account is activated successfully`,
    });
  } catch (error: any) {
    next(createError(500, error));
  }
};

export const myProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?._id;

    const user = await User.findById(id);

    if (!user) {
      throw createError(404, "User not found");
    }
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error: any) {
    next(createError(500, error));
  }
};
