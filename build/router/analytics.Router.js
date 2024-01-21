"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const analytics_Controller_1 = require("../controller/analytics.Controller");
const analyticsRouter = express_1.default.Router();
analyticsRouter.get("/generationCount", authMiddleware_1.isLogIn, analytics_Controller_1.getAllGeneration);
analyticsRouter.get("/mothlyCount", authMiddleware_1.isLogIn, analytics_Controller_1.generateGenerationData);
analyticsRouter.get("/userAnalitic", analytics_Controller_1.userAnalytics);
analyticsRouter.get("/mediaAnalytic", analytics_Controller_1.generateAllMediaCount);
exports.default = analyticsRouter;
