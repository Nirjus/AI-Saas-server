"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const secret_1 = require("./secret/secret");
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: secret_1.cloud_name,
    api_key: secret_1.cloud_api_key,
    api_secret: secret_1.cloud_api_secret
});
app_1.app.listen(secret_1.port, async () => {
    console.log(`server is running on http://localhost:${secret_1.port}`);
    await (0, db_1.connectDB)();
});
