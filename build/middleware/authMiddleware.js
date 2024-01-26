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
exports.isAdmin = exports.isLogIn = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth_controller_1 = require("../controller/userAuth.controller");
const user_Model_1 = require("../model/user.Model");
const isLogIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { access_token } = req.cookies;
        if (!access_token) {
            try {
                yield (0, userAuth_controller_1.updateAccessToken)(req, res, next);
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
});
exports.isLogIn = isLogIn;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found");
        }
        if (user.role === "Admin") {
            next();
        }
        else {
            throw (0, http_errors_1.default)(404, "you are not authorized to access this resourses");
        }
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.isAdmin = isAdmin;
