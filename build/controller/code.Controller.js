"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllcodes = exports.createCode = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const replicate_1 = __importDefault(require("replicate"));
const secret_1 = require("../secret/secret");
const code_Mode_1 = require("../model/code.Mode");
const checkApiLimit_1 = require("../helper/checkApiLimit");
const subscription_Model_1 = require("../model/subscription.Model");
const replicate = new replicate_1.default({
    auth: secret_1.replicateToken
});
const DAY_IN_MS = 86400000;
const createCode = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const { prompt } = req.body;
        const userSubscription = await subscription_Model_1.Subscription.findOne({
            userId: user?._id
        });
        const isValid = userSubscription?.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
        const freeTrail = await (0, checkApiLimit_1.checkAPIlimit)(user, id);
        if (!freeTrail && !isValid) {
            throw (0, http_errors_1.default)(404, "You reached the free tier limit!");
        }
        const output = await replicate.run("meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3", {
            input: {
                debug: false,
                top_k: 50,
                top_p: 1,
                prompt: prompt,
                temperature: 0.5,
                system_prompt: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations",
                max_new_tokens: 500,
                min_new_tokens: -1
            }
        });
        const textString = output.join('');
        const code = await code_Mode_1.Code.create({
            prompt: prompt,
            solution: textString,
            creatorId: user?._id
        });
        res.status(201).json({
            success: true,
            output: code.solution
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.createCode = createCode;
const getAllcodes = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const codes = await code_Mode_1.Code.find({
            creatorId: user?._id
        }).sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            codesArray: codes
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.getAllcodes = getAllcodes;
