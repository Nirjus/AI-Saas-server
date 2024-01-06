"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replicateToken = exports.stripeWebhooks = exports.stripeSecretKey = exports.stripePublishKey = exports.maxFreeCredit = exports.resetPassKey = exports.cloud_api_secret = exports.cloud_api_key = exports.cloud_name = exports.refeshToken = exports.accessToken = exports.smtpPassword = exports.smtpUserName = exports.jwtActivationKey = exports.frontendUrl = exports.mongoUri = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "./secret/.env"
});
exports.port = process.env.PORT || 5001;
exports.mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/aiSaas";
exports.frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
exports.jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "JHGFf^%$%^%$jhJH6857";
exports.smtpUserName = process.env.SMTP_USERNAME;
exports.smtpPassword = process.env.SMTP_PASSWORD;
exports.accessToken = process.env.ACCESS_TOKEN || "HGKFxHG65$^#7GHJGC6r5";
exports.refeshToken = process.env.REFERESH_TOKEN || "MNHJkgFJGHfUrE%^&$3ghjk";
exports.cloud_name = process.env.CLOUD_NAME || "";
exports.cloud_api_key = process.env.CLOUD_API_KEY || "";
exports.cloud_api_secret = process.env.CLOUD_API_SECRET || "";
exports.resetPassKey = process.env.JWT_RESET_PASS_KEY || "VHGDgfdGFD%$%^$65DG65";
exports.maxFreeCredit = Number(process.env.MAX_FREE_CREDIT) || 5;
exports.stripePublishKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
exports.stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
exports.stripeWebhooks = process.env.STRIPE_WEBHOOK_SECRET || "";
exports.replicateToken = process.env.REPLICATE_TOKEN || "";
