"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_controller_1 = require("../controller/userAuth.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authRouter = express_1.default.Router();
authRouter.post("/login", userAuth_controller_1.LogIn);
authRouter.get("/logout", authMiddleware_1.isLogIn, userAuth_controller_1.logOut);
authRouter.post("/social-auth", userAuth_controller_1.socialAuth);
exports.default = authRouter;
