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
exports.getAllImage = exports.imageGeneration = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const replicate_1 = __importDefault(require("replicate"));
const secret_1 = require("../secret/secret");
const image_Model_1 = require("../model/image.Model");
const checkApiLimit_1 = require("../helper/checkApiLimit");
const subscription_Model_1 = require("../model/subscription.Model");
const cloudinary_1 = __importDefault(require("cloudinary"));
const replicate = new replicate_1.default({
    auth: secret_1.replicateToken
});
const DAY_IN_MS = 86400000;
const imageGeneration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_Model_1.User.findById(id);
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
        const userSubscription = yield subscription_Model_1.Subscription.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id
        });
        const isValid = (userSubscription === null || userSubscription === void 0 ? void 0 : userSubscription.stripePriceId) && ((_b = userSubscription.stripeCurrentPeriodEnd) === null || _b === void 0 ? void 0 : _b.getTime()) + DAY_IN_MS > Date.now();
        const freeTrail = yield (0, checkApiLimit_1.checkAPIlimit)(user, id);
        if (!freeTrail && !isValid) {
            throw (0, http_errors_1.default)(404, "You reached the free tier limit!");
        }
        const output = yield replicate.run("stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", {
            input: {
                prompt: prompt,
                num_outputs: num
            }
        });
        console.log(output);
        const picture = yield image_Model_1.Image.create({
            prompt: prompt,
            creatorId: user === null || user === void 0 ? void 0 : user._id
        });
        const imageArray = [];
        for (let i = 0; i < output.length; i++) {
            const myCloude = yield cloudinary_1.default.v2.uploader.upload(output[i], {
                folder: "AI-Saas"
            });
            imageArray.push({
                public_id: myCloude.public_id,
                url: myCloude.secure_url
            });
        }
        picture.image = imageArray;
        yield picture.save();
        res.status(201).json({
            success: true,
            output: picture.image
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.imageGeneration = imageGeneration;
const getAllImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const id = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const images = yield image_Model_1.Image.find({
            creatorId: user === null || user === void 0 ? void 0 : user._id
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
});
exports.getAllImage = getAllImage;
