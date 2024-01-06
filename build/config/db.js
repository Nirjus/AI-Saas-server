"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const secret_1 = require("../secret/secret");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(secret_1.mongoUri);
        console.log(`database is connected at ${mongoose_1.default.connection.host}`);
        mongoose_1.default.connection.on("error", (error) => {
            console.error(error);
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.connectDB = connectDB;
