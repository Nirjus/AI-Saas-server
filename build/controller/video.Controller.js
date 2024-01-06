"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVideo = exports.videoGeneration = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const replicate_1 = __importDefault(require("replicate"));
const secret_1 = require("../secret/secret");
const video_model_1 = require("../model/video.model");
const checkApiLimit_1 = require("../helper/checkApiLimit");
const subscription_Model_1 = require("../model/subscription.Model");
const replicate = new replicate_1.default({
    auth: secret_1.replicateToken
});
const DAY_IN_MS = 86400000;
const videoGeneration = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const { prompt } = req.body;
        if (!prompt) {
            throw (0, http_errors_1.default)(404, "Prompt is required");
        }
        const userSubscription = await subscription_Model_1.Subscription.findOne({
            userId: user?._id
        });
        const isValid = userSubscription?.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
        const freeTrail = await (0, checkApiLimit_1.checkAPIlimit)(user, id);
        if (!freeTrail && !isValid) {
            throw (0, http_errors_1.default)(404, "You reached the free tier limit!");
        }
        const output = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", {
            input: {
                prompt: prompt
            }
        });
        const video = await video_model_1.Video.create({
            prompt: prompt,
            video: output[0],
            creatorId: user?._id
        });
        res.status(201).json({
            success: true,
            output: video.video
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.videoGeneration = videoGeneration;
const getAllVideo = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const videos = await video_model_1.Video.find({
            creatorId: user?._id
        }).sort({ createdAt: -1 });
        if (!videos) {
            throw (0, http_errors_1.default)(404, "No video is have till now");
        }
        res.status(201).json({
            success: true,
            videos
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.getAllVideo = getAllVideo;
