"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    //   mongodb error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = (0, http_errors_1.default)(400, message);
    }
    // duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = (0, http_errors_1.default)(400, message);
    }
    //  jwt error
    if (err.name === "JsonWebTokenError") {
        const message = "Json web token is invalid, try again";
        err = (0, http_errors_1.default)(400, message);
    }
    //  jwt expaired error
    if (err.name === "TokenExpiredError") {
        const message = "Json web token is expired, try again";
        err = (0, http_errors_1.default)(400, message);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.errorMiddleware = errorMiddleware;
