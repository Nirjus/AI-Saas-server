"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const stripeCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not fount");
        }
        const userSubscription = yield subscription_Model_1.Subscription.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id
        });
        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = yield exports.stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: `${secret_1.frontendUrl}/settings`
            });
            return res.status(201).json({
                success: true,
                url: stripeSession.url
            });
        }
        const stripeSession = yield exports.stripe.checkout.sessions.create({
            success_url: `${secret_1.frontendUrl}/settings`,
            cancel_url: `${secret_1.frontendUrl}/settings`,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user === null || user === void 0 ? void 0 : user.email,
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
});
exports.stripeCheckout = stripeCheckout;
const stripeWebhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
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
        const subscription = yield exports.stripe.subscriptions.retrieve(session.subscription);
        if (!((_b = session === null || session === void 0 ? void 0 : session.metadata) === null || _b === void 0 ? void 0 : _b.id)) {
            throw (0, http_errors_1.default)(400, "User Id is required");
        }
        yield subscription_Model_1.Subscription.create({
            userId: (_c = session === null || session === void 0 ? void 0 : session.metadata) === null || _c === void 0 ? void 0 : _c.id,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
    }
    if (event.type === "invoice.payment_succeeded") {
        const subscription = yield exports.stripe.subscriptions.retrieve(session.subscription);
        yield subscription_Model_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, {
            stripePriceId: subscription.items.data[0].id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
        });
    }
    res.status(200).json(null);
});
exports.stripeWebhook = stripeWebhook;
const checkSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const id = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not fount");
        }
        const userSubscription = yield subscription_Model_1.Subscription.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id
        });
        if (!userSubscription) {
            throw (0, http_errors_1.default)(404, "user is not subscribed!");
        }
        const isValid = userSubscription.stripePriceId && ((_e = userSubscription.stripeCurrentPeriodEnd) === null || _e === void 0 ? void 0 : _e.getTime()) + DAY_IN_MS > Date.now();
        res.status(201).json({
            success: true,
            isValid
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.checkSubscription = checkSubscription;
