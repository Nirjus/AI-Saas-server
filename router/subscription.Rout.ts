import express from "express";
import { isLogIn } from "../middleware/authMiddleware";
import { checkSubscription, stripeCheckout } from "../controller/payment.Controller";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/stripeCheckout", isLogIn, stripeCheckout);
subscriptionRouter.get("/check", isLogIn, checkSubscription);

export default subscriptionRouter;