import express from "express";
import { isLogIn } from "../middleware/authMiddleware";
import { generateAllMediaCount, generateGenerationData, getAllGeneration, userAnalytics } from "../controller/analytics.Controller";

const analyticsRouter = express.Router();

analyticsRouter.get("/generationCount", isLogIn, getAllGeneration);
analyticsRouter.get("/mothlyCount", isLogIn, generateGenerationData);

analyticsRouter.get("/userAnalitic",  userAnalytics);
analyticsRouter.get("/mediaAnalytic", generateAllMediaCount);

export default analyticsRouter;