"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const video_Controller_1 = require("../controller/video.Controller");
const videoRouter = express_1.default.Router();
videoRouter.post("/video-generation", authMiddleware_1.isLogIn, video_Controller_1.videoGeneration);
videoRouter.get("/getAllvideo", authMiddleware_1.isLogIn, video_Controller_1.getAllVideo);
exports.default = videoRouter;
