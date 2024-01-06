"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const codeSchema = new mongoose_1.default.Schema({
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
        minlength: [4, "minmum character should be 4"]
    },
    solution: {
        type: String
    },
    creatorId: {
        type: String
    }
}, { timestamps: true });
exports.Code = mongoose_1.default.model("codes", codeSchema);
