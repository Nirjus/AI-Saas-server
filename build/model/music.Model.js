"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Music = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const musicSchema = new mongoose_1.default.Schema({
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
        minlength: [3, "Minimum 3 character is required"]
    },
    music: {
        type: String,
    },
    output_format: {
        type: String
    },
    duration: {
        type: Number
    },
    creatorId: {
        type: String,
    }
}, {
    timestamps: true
});
exports.Music = mongoose_1.default.model("music", musicSchema);
