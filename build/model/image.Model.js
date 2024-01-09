"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const imageSchema = new mongoose_1.default.Schema({
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
        minlength: [6, "Prompt should be 6 character long"]
    },
    creatorId: {
        type: String
    },
    image: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    ]
}, {
    timestamps: true
});
exports.Image = mongoose_1.default.model("images", imageSchema);
