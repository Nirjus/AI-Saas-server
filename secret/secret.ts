import dotenv from "dotenv";

dotenv.config({
    path: "./secret/.env"
})

export const port = process.env.PORT || 5001;

export const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/aiSaas";

export const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

export const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "JHGFf^%$%^%$jhJH6857";

export const smtpUserName = process.env.SMTP_USERNAME;

export const smtpPassword = process.env.SMTP_PASSWORD;

export const accessToken = process.env.ACCESS_TOKEN || "HGKFxHG65$^#7GHJGC6r5";

export const refeshToken = process.env.REFERESH_TOKEN || "MNHJkgFJGHfUrE%^&$3ghjk";

export const cloud_name = process.env.CLOUD_NAME || "";

export const cloud_api_key = process.env.CLOUD_API_KEY || "";

export const cloud_api_secret = process.env.CLOUD_API_SECRET || "";

export const resetPassKey = process.env.JWT_RESET_PASS_KEY || "VHGDgfdGFD%$%^$65DG65"

export const maxFreeCredit = Number(process.env.MAX_FREE_CREDIT) || 5;

export const stripePublishKey = process.env.STRIPE_PUBLISHABLE_KEY || "";

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripeWebhooks = process.env.STRIPE_WEBHOOK_SECRET || "";

export const replicateToken = process.env.REPLICATE_TOKEN || "";