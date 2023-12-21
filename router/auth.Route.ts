import express from "express";
import { LogIn, logOut, socialAuth } from "../controller/userAuth.controller";

const authRouter = express.Router();

authRouter.post("/login", LogIn);
authRouter.get("/logout", logOut);

authRouter.post("/social-auth", socialAuth);
export default authRouter;
