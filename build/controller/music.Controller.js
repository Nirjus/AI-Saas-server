"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMusic = exports.createMusic = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const replicate_1 = __importDefault(require("replicate"));
const secret_1 = require("../secret/secret");
const music_Model_1 = require("../model/music.Model");
const checkApiLimit_1 = require("../helper/checkApiLimit");
const subscription_Model_1 = require("../model/subscription.Model");
const replicate = new replicate_1.default({
    auth: secret_1.replicateToken,
});
const DAY_IN_MS = 86400000;
const createMusic = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const { prompt, duration, format } = req.body;
        if (!prompt) {
            throw (0, http_errors_1.default)(404, "prompt is required");
        }
        if (!duration) {
            throw (0, http_errors_1.default)(404, "duration is required");
        }
        if (!format) {
            throw (0, http_errors_1.default)(404, "Audio format is required");
        }
        const userSubscription = await subscription_Model_1.Subscription.findOne({
            userId: user?._id
        });
        const isValid = userSubscription?.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
        const freeTrail = await (0, checkApiLimit_1.checkAPIlimit)(user, id);
        if (!freeTrail && !isValid) {
            throw (0, http_errors_1.default)(404, "You reached the free tier limit!");
        }
        const output = await replicate.run("meta/musicgen:7be0f12c54a8d033a0fbd14418c9af98962da9a86f5ff7811f9b3423a1f0b7d7", {
            input: {
                top_k: 250,
                top_p: 0,
                prompt: prompt,
                duration: duration,
                temperature: 1,
                continuation: false,
                model_version: "stereo-melody-large",
                output_format: format,
                continuation_start: 0,
                multi_band_diffusion: false,
                normalization_strategy: "peak",
                classifier_free_guidance: 3,
            },
        });
        const music = await music_Model_1.Music.create({
            prompt: prompt,
            music: output,
            output_format: format,
            duration: duration,
            creatorId: user?._id,
        });
        res.status(201).json({
            success: true,
            output: music.music,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.createMusic = createMusic;
const getAllMusic = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const audios = await music_Model_1.Music.find({
            creatorId: user?._id
        }).sort({ createdAt: -1 });
        if (!audios) {
            throw (0, http_errors_1.default)(404, "You not have any audio files");
        }
        res.status(201).json({
            success: true,
            audios,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.getAllMusic = getAllMusic;
