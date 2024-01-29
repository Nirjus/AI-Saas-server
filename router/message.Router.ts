import express from "express";
import {  getMessage,  messageCreation } from "../controller/messages.Controller";

const messageRouter = express.Router();

messageRouter.post("/create",  messageCreation);

messageRouter.get("/getmsg",  getMessage);

export default messageRouter;