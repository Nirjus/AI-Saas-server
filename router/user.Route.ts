import express from "express";
import {
  activateUser,
  myProfile,
  userRegistartion,
} from "../controller/user.Controller";
import { isLogIn } from "../middleware/authMiddleware";

const userRouter = express.Router();

userRouter.post("/register", userRegistartion);
userRouter.post("/activate/:token", activateUser);

userRouter.get("/me", isLogIn, myProfile);

export default userRouter;
