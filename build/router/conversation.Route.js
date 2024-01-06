"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const conversation_Controller_1 = require("../controller/conversation.Controller");
const conversationRoute = express_1.default.Router();
conversationRoute.post("/create-conversation", authMiddleware_1.isLogIn, conversation_Controller_1.createConversation);
conversationRoute.get("/getAllconversation", authMiddleware_1.isLogIn, conversation_Controller_1.getAllConversation);
exports.default = conversationRoute;
