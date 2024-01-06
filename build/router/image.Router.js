"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const image_Controller_1 = require("../controller/image.Controller");
const imageRouter = express_1.default.Router();
imageRouter.post("/image-generation", authMiddleware_1.isLogIn, image_Controller_1.imageGeneration);
imageRouter.get("/getAllImages", authMiddleware_1.isLogIn, image_Controller_1.getAllImage);
exports.default = imageRouter;
