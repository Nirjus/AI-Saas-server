import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import Replicate from "replicate";
import { replicateToken } from "../secret/secret";
import { Music } from "../model/music.Model";
import { checkAPIlimit } from "../helper/checkApiLimit";
import { Subscription } from "../model/subscription.Model";

const replicate = new Replicate({
  auth: replicateToken,
});
const DAY_IN_MS = 86_400_000;

export const createMusic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?._id;
    const user = await User.findById(id);

    if (!user) {
      throw createError(404, "User not found");
    }
    const { prompt, duration, format } = req.body;
   if(!prompt){
    throw createError(404, "prompt is required");
   }
   if(!duration){
    throw createError(404, "duration is required");
   }
   if(!format){
    throw createError(404, "Audio format is required");
   }
   const userSubscription = await Subscription.findOne({
    userId: user?._id
})
const isValid = userSubscription?.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();

    const freeTrail = await checkAPIlimit(user, id);

    if (!freeTrail && !isValid) {
      throw createError(404, "You reached the free tier limit!");
    }
    const output: any = await replicate.run(
      "meta/musicgen:7be0f12c54a8d033a0fbd14418c9af98962da9a86f5ff7811f9b3423a1f0b7d7",
      {
        input: {
          top_k: 250,
          top_p: 0,
          prompt: prompt,
          duration: duration,
          temperature: 1,
          continuation: false,
          model_version: "stereo-melody-large",
          output_format: format,
          continuation_start: 0,
          multi_band_diffusion: false,
          normalization_strategy: "peak",
          classifier_free_guidance: 3,
        },
      }
    );
    const music = await Music.create({
      prompt: prompt,
      music: output,
      output_format: format,
      duration: duration,
      creatorId: user?._id,
    });
    res.status(201).json({
      success: true,
      output: music.music,
    });
  } catch (error: any) {
    next(createError(500, error));
  }
};

export const getAllMusic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?._id;
    const user = await User.findById(id);

    if (!user) {
      throw createError(404, "User not found");
    }
    const audios = await Music.find({
      creatorId:user?._id
    }).sort({ createdAt: -1 });
    if (!audios) {
      throw createError(404, "You not have any audio files");
    }
    
    res.status(201).json({
      success: true,
      audios,
    });
  } catch (error: any) {
    next(createError(500, error));
  }
};
