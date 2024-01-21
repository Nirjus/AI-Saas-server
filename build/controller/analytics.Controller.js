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
exports.generateAllMediaCount = exports.userAnalytics = exports.generateGenerationData = exports.getAllGeneration = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_Model_1 = require("../model/user.Model");
const music_Model_1 = require("../model/music.Model");
const video_model_1 = require("../model/video.model");
const code_Mode_1 = require("../model/code.Mode");
const image_Model_1 = require("../model/image.Model");
const conversation_Model_1 = require("../model/conversation.Model");
const analytics_generator_1 = require("../utils/analytics.generator");
const getAllGeneration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found");
        }
        const musics = yield music_Model_1.Music.find({
            creatorId: user === null || user === void 0 ? void 0 : user._id
        });
        const videos = yield video_model_1.Video.find({
            creatorId: user === null || user === void 0 ? void 0 : user._id
        });
        const codes = yield code_Mode_1.Code.find({
            creatorId: user === null || user === void 0 ? void 0 : user._id
        });
        const images = yield image_Model_1.Image.find({
            creatorId: user === null || user === void 0 ? void 0 : user._id
        });
        const chats = yield conversation_Model_1.Conversation.find({
            creatorId: user === null || user === void 0 ? void 0 : user._id
        });
        const items = [
            {
                itemName: "Chat",
                itemNumber: chats.length
            },
            {
                itemName: "Music",
                itemNumber: musics.length
            },
            {
                itemName: "Video",
                itemNumber: videos.length
            },
            {
                itemName: "Codes",
                itemNumber: codes.length
            },
            {
                itemName: "Image",
                itemNumber: images.length
            }
        ];
        res.status(201).json({
            success: true,
            items
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.getAllGeneration = getAllGeneration;
const generateGenerationData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const user = yield user_Model_1.User.findById(id);
        if (!user) {
            throw (0, http_errors_1.default)(404, "user not found");
        }
        const datas = yield (0, analytics_generator_1.generateLast12MonthsGenerationData)(music_Model_1.Music, video_model_1.Video, image_Model_1.Image, conversation_Model_1.Conversation, code_Mode_1.Code, user._id);
        res.status(201).json({
            success: true,
            datas
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.generateGenerationData = generateGenerationData;
const userAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, analytics_generator_1.generateLast12monthData)(user_Model_1.User);
        if (!users) {
            throw (0, http_errors_1.default)(404, "find user data issue");
        }
        res.status(201).json({
            success: true,
            users
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.userAnalytics = userAnalytics;
const generateAllMediaCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const musics = yield music_Model_1.Music.find({});
        const videos = yield video_model_1.Video.find({});
        const codes = yield code_Mode_1.Code.find({});
        const images = yield image_Model_1.Image.find({});
        const chats = yield conversation_Model_1.Conversation.find({});
        const items = [
            {
                itemName: "Chat",
                itemNumber: chats.length
            },
            {
                itemName: "Music",
                itemNumber: musics.length
            },
            {
                itemName: "Video",
                itemNumber: videos.length
            },
            {
                itemName: "Codes",
                itemNumber: codes.length
            },
            {
                itemName: "Image",
                itemNumber: images.length
            }
        ];
        res.status(201).json({
            success: true,
            items
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error));
    }
});
exports.generateAllMediaCount = generateAllMediaCount;
