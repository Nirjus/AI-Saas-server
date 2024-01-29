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
exports.getMessage = exports.messageCreation = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const message_Model_1 = require("../model/message.Model");
const messageCreation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, role, content } = req.body;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found");
        }
        let message = yield message_Model_1.Messages.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id
        });
        if (message) {
            message.messages.push({
                role: role,
                content: content,
                timeStamps: new Date()
            });
            message.save();
        }
        else {
            message = yield message_Model_1.Messages.create({
                userId: user === null || user === void 0 ? void 0 : user._id,
                messages: [
                    {
                        role: role,
                        content: content,
                        timeStamps: new Date()
                    }
                ]
            });
        }
        res.status(201).json({
            success: true,
            message
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.messageCreation = messageCreation;
const getMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found");
        }
        const messages = yield message_Model_1.Messages.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id
        });
        if (!messages) {
            throw (0, http_errors_1.default)(404, "messages not found");
        }
        res.status(201).json({
            success: true,
            messages: messages.messages
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.getMessage = getMessage;
