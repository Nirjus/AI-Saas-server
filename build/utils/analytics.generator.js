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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLast12MonthsGenerationData = exports.generateLast12monthData = void 0;
function generateLast12monthData(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const last12Months = [];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        for (let i = 11; i >= 0; i--) {
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
            const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);
            const monthYear = endDate.toLocaleString('default', { month: "short", year: "2-digit" });
            const count = yield model.countDocuments({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                }
            });
            last12Months.push({ month: monthYear, count });
        }
        return { last12Months };
    });
}
exports.generateLast12monthData = generateLast12monthData;
function generateLast12MonthsGenerationData(musicModel, videoModel, imageModel, chatModel, codeModel, 
// Add parameters for Image, Code, and Chat models
userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const last12MonthsUserData = [];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        for (let i = 11; i >= 0; i--) {
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
            const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);
            const monthYear = endDate.toLocaleString('default', { day: "numeric", month: "short", year: "2-digit" });
            const musicCount = yield musicModel.countDocuments({ creatorId: userId, createdAt: { $gte: startDate, $lt: endDate } });
            const videoCount = yield videoModel.countDocuments({ creatorId: userId, createdAt: { $gte: startDate, $lt: endDate } });
            const imageCount = yield imageModel.countDocuments({ creatorId: userId, createdAt: { $gte: startDate, $lt: endDate } });
            const codeCount = yield codeModel.countDocuments({ creatorId: userId, createdAt: { $gte: startDate, $lt: endDate } });
            const chatCount = yield chatModel.countDocuments({ creatorId: userId, createdAt: { $gte: startDate, $lt: endDate } });
            // Similar counts for Image, Code, and Chat models
            const monthData = {
                month: monthYear,
                musicGeneration: musicCount,
                videoGeneration: videoCount,
                // Add counts for Image, Code, and Chat
                imageGeneration: imageCount, // Replace with actual count
                codeGeneration: codeCount, // Replace with actual count
                chatGeneration: chatCount, // Replace with actual count
            };
            last12MonthsUserData.push(monthData);
        }
        return { last12MonthsUserData };
    });
}
exports.generateLast12MonthsGenerationData = generateLast12MonthsGenerationData;
