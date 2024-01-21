"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const secret_1 = require("./secret/secret");
const http_errors_1 = __importDefault(require("http-errors"));
const error_1 = require("./utils/error");
const user_Route_1 = __importDefault(require("./router/user.Route"));
const auth_Route_1 = __importDefault(require("./router/auth.Route"));
const conversation_Route_1 = __importDefault(require("./router/conversation.Route"));
const music_Router_1 = __importDefault(require("./router/music.Router"));
const video_Router_1 = __importDefault(require("./router/video.Router"));
const image_Router_1 = __importDefault(require("./router/image.Router"));
const code_Router_1 = __importDefault(require("./router/code.Router"));
const analytics_Router_1 = __importDefault(require("./router/analytics.Router"));
const subscription_Rout_1 = __importDefault(require("./router/subscription.Rout"));
const payment_Controller_1 = require("./controller/payment.Controller");
exports.app = (0, express_1.default)();
exports.app.use("/api/webhook", express_1.default.raw({ type: 'application/json' }), payment_Controller_1.stripeWebhook);
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use((0, cors_1.default)({
    origin: [secret_1.frontendUrl],
    credentials: true,
}));
//  routes
exports.app.use("/api/user", user_Route_1.default);
exports.app.use("/api/auth", auth_Route_1.default);
exports.app.use("/api/conversation", conversation_Route_1.default);
exports.app.use("/api/music", music_Router_1.default);
exports.app.use("/api/video", video_Router_1.default);
exports.app.use("/api/image", image_Router_1.default);
exports.app.use("/api/code", code_Router_1.default);
exports.app.use("/api/analytics", analytics_Router_1.default);
exports.app.use("/api/subscription", subscription_Rout_1.default);
exports.app.get("/test", (req, res) => {
    res.status(201).json({
        success: true,
        message: "API is ready"
    });
});
exports.app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, `Route ${req.originalUrl} not found`));
});
exports.app.use(error_1.errorMiddleware);
