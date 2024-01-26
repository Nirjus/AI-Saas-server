"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    userId: {
        type: String
    },
    messages: [
        {
            role: String,
            content: String,
            timeStamps: Date,
        }
    ]
}, {
    timestamps: true
});
exports.Messages = mongoose_1.default.model("messages", messageSchema);
