import express from "express";
import { isLogIn } from "../middleware/authMiddleware";
import { getAllVideo, videoGeneration } from "../controller/video.Controller";

const videoRouter = express.Router();

videoRouter.post("/video-generation", isLogIn, videoGeneration);
videoRouter.get("/getAllvideo", isLogIn, getAllVideo);

export default videoRouter;