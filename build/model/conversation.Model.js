"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
        minlength: [3, "Minimum 3 character is required"]
    },
    answer: {
        type: String
    },
    creatorId: {
        type: String
    }
}, {
    timestamps: true
});
exports.Conversation = mongoose_1.default.model("conversations", conversationSchema);
