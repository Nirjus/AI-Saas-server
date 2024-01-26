import express from "express";
import { isAdmin, isLogIn } from "../middleware/authMiddleware";
import { checkSubscription, getSubscriber, stripeCheckout } from "../controller/payment.Controller";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/stripeCheckout", isLogIn, stripeCheckout);
subscriptionRouter.get("/check", isLogIn, checkSubscription);

// admin route
subscriptionRouter.get("/get-all-subscribers", isLogIn,isAdmin, getSubscriber);

export default subscriptionRouter;