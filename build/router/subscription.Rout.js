"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const payment_Controller_1 = require("../controller/payment.Controller");
const subscriptionRouter = express_1.default.Router();
subscriptionRouter.get("/stripeCheckout", authMiddleware_1.isLogIn, payment_Controller_1.stripeCheckout);
subscriptionRouter.get("/check", authMiddleware_1.isLogIn, payment_Controller_1.checkSubscription);
exports.default = subscriptionRouter;
