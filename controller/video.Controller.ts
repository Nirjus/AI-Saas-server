import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import Replicate from "replicate";
import { maxFreeCredit, replicateToken } from "../secret/secret";
import { Video } from "../model/video.model";
import { checkAPIlimit } from "../helper/checkApiLimit";
import { Subscription } from "../model/subscription.Model";

const replicate = new Replicate({
    auth: replicateToken
})

const DAY_IN_MS = 86_400_000;

export const videoGeneration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "User not found");
        }
        const {prompt} = req.body;
        if(!prompt){
            throw createError(404, "Prompt is required");
        }
        const userSubscription = await Subscription.findOne({
            userId: user?._id
        })
        const isValid = userSubscription?.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
    
        const freeTrail = await checkAPIlimit(user,id); 
        
        if(!freeTrail && !isValid){
          throw createError(404, "You reached the free tier limit!");
        }
      
        const output:any = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
              input: {
                prompt: prompt
              }
            }
          );
          const video = await Video.create({
            prompt: prompt,
            video: output[0],
            creatorId: user?._id
          })
        res.status(201).json({
            success: true,
            output: video.video
        })
    } catch (error: any) {
        next(createError(500, error))
    }
}
export const getAllVideo = async (req:Request, res: Response, next: NextFunction) => {

    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "User not found");
        }
        const videos = await Video.find().sort({createdAt: -1});

        if(!videos){
            throw createError(404, "No video is have till now");
        }
        const videoArray:any = [];
        videos && videos.map((video:any) => (
            video.creatorId === user?._id.toString() && videoArray.push(video)
        ))
        res.status(201).json({
            success: true,
            videos: videoArray
        })
    } catch (error: any) {
        next(createError(500, error));
    }
}
