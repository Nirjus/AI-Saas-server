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