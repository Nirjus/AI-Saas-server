import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import { Music } from "../model/music.Model";
import { Video } from "../model/video.model";
import { Code } from "../model/code.Mode";
import { Image } from "../model/image.Model";
import { Conversation } from "../model/conversation.Model";
import { generateLast12MonthsGenerationData, generateLast12monthData } from "../utils/analytics.generator";

interface ILengthData{
    itemName: string;
    itemNumber: number;
}
export const getAllGeneration = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "user not found");
        }
        const musics = await Music.find({
            creatorId: user?._id
        });
        const videos = await Video.find({
            creatorId: user?._id
        });
        const codes = await Code.find({
            creatorId: user?._id
        });
        const images = await Image.find({
            creatorId: user?._id
        });
        const chats = await Conversation.find({
            creatorId: user?._id
        });

        const items:ILengthData[] = [
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
        ]

        res.status(201).json({
            success: true,
            items
        })
    } catch (error: any) {
        next(createError(500, error));
    }
}
export const generateGenerationData = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "user not found");
        }
         const datas = await generateLast12MonthsGenerationData(Music, Video, Image, Conversation,Code, user._id);
    
         res.status(201).json({
            success: true,
            datas
         })

    } catch (error: any) {
         next(createError(500, error));
    }
}
export const userAnalytics = async (req: Request, res: Response, next: NextFunction) => {

    try {
         const users = await generateLast12monthData(User);
          if(!users){
            throw createError(404, "find user data issue");
          }
         res.status(201).json({
            success: true,
            users
         })

    } catch (error: any) {
         next(createError(500, error));
    }
}

export const generateAllMediaCount = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const musics = await Music.find({});
        const videos = await Video.find({});
        const codes = await Code.find({});
        const images = await Image.find({});
        const chats = await Conversation.find({});

        const items:ILengthData[] = [
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
        ]
         res.status(201).json({
            success: true,
            items
         })

    } catch (error: any) {
         next(createError(500, error));
    }
}