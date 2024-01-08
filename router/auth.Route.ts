import express from "express";
import { LogIn, logOut, socialAuth } from "../controller/userAuth.controller";
import { isLogIn } from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/login", LogIn);
authRouter.get("/logout", isLogIn,logOut);

authRouter.post("/social-auth", socialAuth);
export default authRouter;
