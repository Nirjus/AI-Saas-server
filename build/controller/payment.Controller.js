"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscription = exports.stripeWebhook = exports.stripeCheckout = exports.stripe = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const stripe_1 = __importDefault(require("stripe"));
const secret_1 = require("../secret/secret");
const user_Model_1 = require("../model/user.Model");
const subscription_Model_1 = require("../model/subscription.Model");
exports.stripe = new stripe_1.default(secret_1.stripeSecretKey, {
    apiVersion: "2023-10-16",
    typescript: true
});
const DAY_IN_MS = 86400000;
const stripeCheckout = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not fount");
        }
        const userSubscription = await subscription_Model_1.Subscription.findOne({
            userId: user?._id
        });
        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await exports.stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: `${secret_1.frontendUrl}/settings`
            });
            return res.status(201).json({
                success: true,
                url: stripeSession.url
            });
        }
        const stripeSession = await exports.stripe.checkout.sessions.create({
            success_url: `${secret_1.frontendUrl}/settings`,
            cancel_url: `${secret_1.frontendUrl}/settings`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user?.email,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "AI Studio Pro",
                            description: "Unlimited Ai Generation",
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                id
            }
        });
        return res.status(201).json({
            success: true,
            url: stripeSession.url
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.stripeCheckout = stripeCheckout;
const stripeWebhook = async (req, res, next) => {
    const signature = req.headers["stripe-signature"];
    let event;
    try {
        event = exports.stripe.webhooks.constructEvent(req.body, signature, secret_1.stripeWebhooks);
    }
    catch (error) {
        console.log("Webhook error", error);
        next((0, http_errors_1.default)(500, error));
        return;
    }
    const session = event.data.object;
    if (event.type === "checkout.session.completed") {
        const subscription = await exports.stripe.subscriptions.retrieve(session.subscription);
        if (!session?.metadata?.id) {
            throw (0, http_errors_1.default)(400, "User Id is required");
        }
        await subscription_Model_1.Subscription.create({
            userId: session?.metadata?.id,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
    }
    if (event.type === "invoice.payment_succeeded") {
        const subscription = await exports.stripe.subscriptions.retrieve(session.subscription);
        await subscription_Model_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, {
            stripePriceId: subscription.items.data[0].id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
        });
    }
    res.status(200).json(null);
};
exports.stripeWebhook = stripeWebhook;
const checkSubscription = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not fount");
        }
        const userSubscription = await subscription_Model_1.Subscription.findOne({
            userId: user?._id
        });
        if (!userSubscription) {
            throw (0, http_errors_1.default)(404, "user is not subscribed!");
        }
        const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
        res.status(201).json({
            success: true,
            isValid
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.checkSubscription = checkSubscription;
