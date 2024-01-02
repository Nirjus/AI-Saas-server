import express,{NextFunction, Request, Response} from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { frontendUrl } from "./secret/secret";
import createError from "http-errors";
import { errorMiddleware } from "./utils/error";
import userRouter from "./router/user.Route";
import authRouter from "./router/auth.Route";
import conversationRoute from "./router/conversation.Route";
import musicRouter from "./router/music.Router";
import videoRouter from "./router/video.Router";
import imageRouter from "./router/image.Router";
import codeRouter from "./router/code.Router";

export const app = express();
app.use(express.json({limit:"50mb"}));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
    origin:[frontendUrl],
    credentials: true,
}))

//  routes
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/conversation",conversationRoute)
app.use("/api/music", musicRouter)
app.use("/api/video", videoRouter);
app.use("/api/image", imageRouter);
app.use("/api/code", codeRouter);

app.get("/test",(req:Request, res: Response)=> {
    res.status(201).json({
        success: true,
        message: "API is ready"
    })
})

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, `Route ${req.originalUrl} not found`));
})

app.use(errorMiddleware);