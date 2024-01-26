"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_Controller_1 = require("../controller/user.Controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userRouter = express_1.default.Router();
userRouter.post("/register", user_Controller_1.userRegistartion);
userRouter.post("/activate/:token", user_Controller_1.activateUser);
userRouter.get("/me", authMiddleware_1.isLogIn, user_Controller_1.myProfile);
userRouter.delete("/remove-account/:id", authMiddleware_1.isLogIn, user_Controller_1.deleteProfile);
userRouter.put("/update-user", authMiddleware_1.isLogIn, user_Controller_1.updateProfile);
userRouter.put("/update-password", authMiddleware_1.isLogIn, user_Controller_1.updatePassword);
userRouter.post("/forget-password", user_Controller_1.forgotPassword);
userRouter.put("/reset-password", user_Controller_1.resetPassword);
userRouter.get("/credit-count", authMiddleware_1.isLogIn, user_Controller_1.getCreditCount);
//  admin route
userRouter.get("/get-allUser", authMiddleware_1.isLogIn, authMiddleware_1.isAdmin, user_Controller_1.getAllUser);
userRouter.delete("/delete-user/:id", authMiddleware_1.isLogIn, authMiddleware_1.isAdmin, user_Controller_1.deleteUser);
exports.default = userRouter;
