"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const code_Controller_1 = require("../controller/code.Controller");
const codeRouter = express_1.default.Router();
codeRouter.post("/code-generation", authMiddleware_1.isLogIn, code_Controller_1.createCode);
codeRouter.get("/getAllCode", authMiddleware_1.isLogIn, code_Controller_1.getAllcodes);
exports.default = codeRouter;
