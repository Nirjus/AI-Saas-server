"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const videoSchema = new mongoose_1.default.Schema({
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
        minlength: [6, "Prompt should be 6 character long"]
    },
    video: {
        public_id: {
            type: String,
        },
        url: {
            type: String
        }
    },
    creatorId: {
        type: String
    }
}, {
    timestamps: true
});
exports.Video = mongoose_1.default.model("videos", videoSchema);
