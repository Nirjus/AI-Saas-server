import express from "express";
import {
  activateUser,
  myProfile,
  userRegistartion,
  deleteProfile,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  getCreditCount
} from "../controller/user.Controller";
import { isLogIn } from "../middleware/authMiddleware";

const userRouter = express.Router();

userRouter.post("/register", userRegistartion);
userRouter.post("/activate/:token", activateUser);

userRouter.get("/me", isLogIn, myProfile);

userRouter.delete("/remove-account/:id", isLogIn, deleteProfile);

userRouter.put("/update-user", isLogIn, updateProfile);
userRouter.put("/update-password", isLogIn, updatePassword);

userRouter.post("/forget-password", forgotPassword);
userRouter.put("/reset-password", resetPassword);

userRouter.get("/credit-count", isLogIn, getCreditCount);

export default userRouter;
