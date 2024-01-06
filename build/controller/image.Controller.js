"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllImage = exports.imageGeneration = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const replicate_1 = __importDefault(require("replicate"));
const secret_1 = require("../secret/secret");
const image_Model_1 = require("../model/image.Model");
const checkApiLimit_1 = require("../helper/checkApiLimit");
const subscription_Model_1 = require("../model/subscription.Model");
const replicate = new replicate_1.default({
    auth: secret_1.replicateToken
});
const DAY_IN_MS = 86400000;
const imageGeneration = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const { prompt, num } = req.body;
        if (!prompt) {
            throw (0, http_errors_1.default)(404, "Prompt is required");
        }
        if (!num) {
            throw (0, http_errors_1.default)(404, "Select Number of Image you want to generate");
        }
        const userSubscription = await subscription_Model_1.Subscription.findOne({
            userId: user?._id
        });
        const isValid = userSubscription?.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
        const freeTrail = await (0, checkApiLimit_1.checkAPIlimit)(user, id);
        if (!freeTrail && !isValid) {
            throw (0, http_errors_1.default)(404, "You reached the free tier limit!");
        }
        const output = await replicate.run("stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", {
            input: {
                prompt: prompt,
                num_outputs: num
            }
        });
        console.log(output);
        const picture = await image_Model_1.Image.create({
            prompt: prompt,
            creatorId: user?._id
        });
        output.map((format) => {
            picture.image.push({
                imageUrl: format
            });
        });
        await picture.save();
        res.status(201).json({
            success: true,
            output: picture.image
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.imageGeneration = imageGeneration;
const getAllImage = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const images = await image_Model_1.Image.find({
            creatorId: user?._id
        }).sort({ createdAt: -1 });
        if (!images) {
            throw (0, http_errors_1.default)(404, "No Image found");
        }
        res.status(201).json({
            success: true,
            images
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
};
exports.getAllImage = getAllImage;
