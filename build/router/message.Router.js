"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messages_Controller_1 = require("../controller/messages.Controller");
const messageRouter = express_1.default.Router();
messageRouter.post("/create", messages_Controller_1.messageCreation);
messageRouter.get("/getmsg", messages_Controller_1.getMessage);
exports.default = messageRouter;
