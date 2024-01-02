import express from "express";
import { isLogIn } from "../middleware/authMiddleware";
import { createCode, getAllcodes } from "../controller/code.Controller";

const codeRouter = express.Router();

codeRouter.post("/code-generation", isLogIn, createCode);
codeRouter.get("/getAllCode", isLogIn,  getAllcodes);

export default codeRouter;