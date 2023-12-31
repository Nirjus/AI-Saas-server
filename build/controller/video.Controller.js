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
exports.getAllVideo = exports.videoGeneration = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const replicate_1 = __importDefault(require("replicate"));
const secret_1 = require("../secret/secret");
const video_model_1 = require("../model/video.model");
const checkApiLimit_1 = require("../helper/checkApiLimit");
const subscription_Model_1 = require("../model/subscription.Model");
const cloudinary_1 = __importDefault(require("cloudinary"));
const replicate = new replicate_1.default({
    auth: secret_1.replicateToken
});
const DAY_IN_MS = 86400000;
const videoGeneration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const { prompt } = req.body;
        if (!prompt) {
            throw (0, http_errors_1.default)(404, "Prompt is required");
        }
        const userSubscription = yield subscription_Model_1.Subscription.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id
        });
        const isValid = (userSubscription === null || userSubscription === void 0 ? void 0 : userSubscription.stripePriceId) && ((_b = userSubscription.stripeCurrentPeriodEnd) === null || _b === void 0 ? void 0 : _b.getTime()) + DAY_IN_MS > Date.now();
        const freeTrail = yield (0, checkApiLimit_1.checkAPIlimit)(user, id);
        if (!freeTrail && !isValid) {
            throw (0, http_errors_1.default)(404, "You reached the free tier limit!");
        }
        const output = yield replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", {
            input: {
                prompt: prompt
            }
        });
        const myCloude = yield cloudinary_1.default.v2.uploader.upload(output[0], {
            folder: "AI-Saas",
            resource_type: "video"
        });
        const video = yield video_model_1.Video.create({
            prompt: prompt,
            video: {
                public_id: myCloude.public_id,
                url: myCloude.secure_url
            },
            creatorId: user === null || user === void 0 ? void 0 : user._id
        });
        res.status(201).json({
            success: true,
            output: video.video
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.videoGeneration = videoGeneration;
const getAllVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const id = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const videos = yield video_model_1.Video.find({
            creatorId: user === null || user === void 0 ? void 0 : user._id
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
});
exports.getAllVideo = getAllVideo;
