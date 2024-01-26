"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccessToken = exports.socialAuth = exports.logOut = exports.LogIn = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_2 = __importDefault(require("../config/jsonwebtoken"));
const secret_1 = require("../secret/secret");
const LogIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            throw new Error("Email is required");
        }
        if (!password) {
            throw new Error("Password is required");
        }
        const user = yield user_Model_1.User.findOne({ email: email });
        if (!user) {
            throw (0, http_errors_1.default)(404, "Please create an account, then try");
        }
        if ((user === null || user === void 0 ? void 0 : user.password) == undefined) {
            throw (0, http_errors_1.default)(404, "choose social login");
        }
        const comparePassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!comparePassword) {
            throw (0, http_errors_1.default)(404, "Password not matched");
        }
        const accesskey = (0, jsonwebtoken_2.default)({ user }, "5m", secret_1.accessToken);
        const refreshKey = (0, jsonwebtoken_2.default)({ user }, "7d", secret_1.refeshToken);
        res.cookie("access_token", accesskey, {
            expires: new Date(Date.now() + 5 * 60 * 1000), // 5min
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.cookie("refresh_token", refreshKey, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7day
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            message: "LogIn successful",
            user,
            accesskey,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.LogIn = LogIn;
const logOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({
            success: true,
            message: "Logout Successfull",
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.logOut = logOut;
const socialAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, socialAvatar } = req.body;
        let user = yield user_Model_1.User.findOne({ email: email });
        if (user) {
            const accesskey = (0, jsonwebtoken_2.default)({ user }, "5m", secret_1.accessToken);
            const refreshKey = (0, jsonwebtoken_2.default)({ user }, "7d", secret_1.refeshToken);
            res.cookie("access_token", accesskey, {
                expires: new Date(Date.now() + 5 * 60 * 1000), // 5min
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.cookie("refresh_token", refreshKey, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7day
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.status(201).json({
                success: true,
                message: "User Login successfully",
                user,
                accesskey
            });
        }
        else {
            user = yield user_Model_1.User.create({
                name: name,
                email: email,
                socialAvatar: socialAvatar,
            });
            const accesskey = (0, jsonwebtoken_2.default)({ user }, "5m", secret_1.accessToken);
            const refreshKey = (0, jsonwebtoken_2.default)({ user }, "7d", secret_1.refeshToken);
            res.cookie("access_token", accesskey, {
                expires: new Date(Date.now() + 5 * 60 * 1000), // 5min
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.cookie("refresh_token", refreshKey, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7day
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.status(201).json({
                success: true,
                message: "User Login successfully",
                user,
                accesskey
            });
        }
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.socialAuth = socialAuth;
const updateAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refresh_token } = req.cookies;
        const decoded = jsonwebtoken_1.default.verify(refresh_token, secret_1.refeshToken);
        if (!decoded) {
            throw (0, http_errors_1.default)(404, "Please Login");
        }
        const user = decoded.user;
        const accessKey = (0, jsonwebtoken_2.default)({ user }, "5m", secret_1.accessToken);
        res.cookie("access_token", accessKey, {
            expires: new Date(Date.now() + 5 * 60 * 1000),
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        req.user = decoded.user;
        next();
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.updateAccessToken = updateAccessToken;
