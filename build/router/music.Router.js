"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const music_Controller_1 = require("../controller/music.Controller");
const musicRouter = express_1.default.Router();
musicRouter.post("/create-music", authMiddleware_1.isLogIn, music_Controller_1.createMusic);
musicRouter.get("/getAllmusic", authMiddleware_1.isLogIn, music_Controller_1.getAllMusic);
exports.default = musicRouter;
