"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = (payload, expiresIn, key) => {
    if (typeof payload !== "object" && !payload) {
        throw new Error("Payload must be a non empty object");
    }
    if (typeof key !== "string" && key === "") {
        throw new Error("Key must be non empty string");
    }
    try {
        const token = jsonwebtoken_1.default.sign(payload, key, { expiresIn });
        return token;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.default = createJWT;
