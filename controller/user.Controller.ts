import { Request, Response, NextFunction } from "express";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import createError from "http-errors";
import { User } from "../model/user.Model";
import createJWT from "../config/jsonwebtoken";
import { frontendUrl, jwtActivationKey, resetPassKey } from "../secret/secret";
import { senEmail } from "../helper/sendEmail";
import cloudinary from "cloudinary";
import bcryptjs from "bcryptjs";

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

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      throw createError(404, "User not found");
    }
    if(user.avatar?.public_id){
    await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
    }
    await User.findByIdAndDelete(id);

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(201).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error: any) {
    next(createError(500, error));
  }
};
interface IUpdateUser{
  name: string;
  avatar:string;
  address: string;
  phoneNumber: number;
}
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const {name, avatar, address, phoneNumber} = req.body as IUpdateUser;
           const id = req.user?._id;
           const user = await User.findById(id);
           if(!user){
            throw createError(404, "user not found!");
           }
    if(name){
      user.name = name
    }
    if(avatar){
      if(user?.avatar?.public_id){
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

        const myCloude = await cloudinary.v2.uploader.upload(avatar,{
          folder: "AI-Saas"
        });
        user.avatar = {
          public_id: myCloude.public_id,
          url: myCloude.secure_url
        }
      }else{
        const myCloude = await cloudinary.v2.uploader.upload(avatar,{
          folder: "AI-Saas"
        });
        user.avatar = {
          public_id: myCloude.public_id,
          url: myCloude.secure_url
        }
      }
    }
    if(address){
      user.address = address;
    }
    if(phoneNumber){
      user.phoneNumber = phoneNumber;
    }
     await user.save();

    res.status(201).json({
      success: true,
      message: "User updated successfully",
      user
    })
  } catch (error: any) {
      next(createError(500, error));
  }
}

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const id = req.user?._id
    const user = await User.findById(id);
   if(!user){
    throw createError(404, 'user not found');
   }
   if(user?.password === undefined){
           throw createError(404, "updtate password is not available in social Authentication")
   }
    const {oldPassword, newPassword, confirmPassword} = req.body;

    const comparePassword1 = await bcryptjs.compare(oldPassword, user?.password);
    
    if(!comparePassword1){
      throw createError(404, "Old Password is incorrect");
    }
    if(newPassword !== confirmPassword){
      throw createError(404, "Confirm password not matched!");
    }
      const updateUser = await User.findByIdAndUpdate(id,{password:confirmPassword},{new: true});
   if(!updateUser){
    throw createError(500, "Password not updated");
   }
    res.status(201).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error: any) {
      next(createError(500, error));
  }
}
export const forgotPassword = async (req: Request, res:Response, next: NextFunction) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
      throw createError(404, "this user not exists");
    }
     const token = createJWT({user},"5m",resetPassKey);
     await senEmail({
      subject: "Reset Password Email",
      email: user?.email,
      html: `
           <h1>Hey ${user?.name}</h1>
           <h1>Click below link, to reset your Password</h1>
           <a href="${frontendUrl}/forgot-password/${token}" target="_blank">RESET PASSWORD</a>
      `
     })
    res.status(201).json({
      success: true,
      message: `Please check your mail: ${user?.email} for reseating your password`,
    })
  } catch (error: any) {
     next(createError(500, error));
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {token, resetPassword}  = req.body;
    const decoded = jsonwebtoken.verify(token, resetPassKey) as JwtPayload;

    if(!decoded){
      throw createError(404, "Invalid token");
    }
    const update = await User.findByIdAndUpdate(decoded.user?._id,{password:resetPassword},{new:true})
     res.status(201).json({
      success: true,
      message: "Password reset successfully"
     })
  } catch (error: any) {
     next(createError(500, error));
  }
}

export const getCreditCount = async (req: Request, res:Response, next: NextFunction) => {

  try {
    const id = req.user?._id;
    const user = await User.findById(id);

    if(!user){
      throw createError(404, "user not found");
    }
    const credit = user?.credit ? user?.credit : 0;
  
    res.status(201).json({
      success: true,
      credit
    })
  } catch (error: any) {
    next(createError(500, error));
  }
}