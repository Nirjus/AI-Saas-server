import express from "express";
import { isLogIn } from "../middleware/authMiddleware";
import { getAllImage, imageGeneration } from "../controller/image.Controller";

const imageRouter = express.Router();

imageRouter.post("/image-generation", isLogIn, imageGeneration);
imageRouter.get("/getAllImages", isLogIn, getAllImage);

export default imageRouter;