"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogIn = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth_controller_1 = require("../controller/userAuth.controller");
const isLogIn = async (req, res, next) => {
    try {
        const { access_token } = req.cookies;
        if (!access_token) {
            try {
                await (0, userAuth_controller_1.updateAccessToken)(req, res, next);
            }
            catch (error) {
                next((0, http_errors_1.default)(404, error));
            }
        }
        else {
            const isVerified = jsonwebtoken_1.default.decode(access_token);
            if (!isVerified) {
                throw (0, http_errors_1.default)(400, "user not verified");
            }
            req.user = isVerified.user;
            next();
        }
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.isLogIn = isLogIn;
