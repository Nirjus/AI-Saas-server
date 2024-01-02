import express from "express";
import { isLogIn } from "../middleware/authMiddleware";
import { createConversation, getAllConversation } from "../controller/conversation.Controller";

const conversationRoute = express.Router();

conversationRoute.post("/create-conversation", isLogIn, createConversation);
conversationRoute.get("/getAllconversation", isLogIn, getAllConversation);

export default conversationRoute;