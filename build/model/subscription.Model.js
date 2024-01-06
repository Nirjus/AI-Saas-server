"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        unique: true,
        required: [true, "userId is required field"],
    },
    stripeCustomerId: {
        type: String,
        unique: true
    },
    stripeSubscriptionId: {
        type: String,
        unique: true,
    },
    stripePriceId: {
        type: String,
        unique: true,
    },
    stripeCurrentPeriodEnd: {
        type: Date
    }
}, { timestamps: true });
exports.Subscription = mongoose_1.default.model("subscriptions", subscriptionSchema);
