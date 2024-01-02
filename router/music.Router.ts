import express from "express";
import { isLogIn } from "../middleware/authMiddleware";
import { createMusic, getAllMusic } from "../controller/music.Controller";

const musicRouter = express.Router();

musicRouter.post("/create-music", isLogIn,createMusic);
musicRouter.get("/getAllmusic", isLogIn, getAllMusic);

export default musicRouter;