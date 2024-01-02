import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import Replicate from "replicate";
import { replicateToken } from "../secret/secret";
import { Music } from "../model/music.Model";

const replicate = new Replicate({
    auth: replicateToken
})

export const createMusic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "User not found");
        }
        const {prompt} = req.body;
        if(!prompt){
            throw createError("Prompt is required!");
        }
        const output:any = await replicate.run(
          "meta/musicgen:7be0f12c54a8d033a0fbd14418c9af98962da9a86f5ff7811f9b3423a1f0b7d7",
            {
              input: {
                prompt: prompt,
                duration: 33,
                model_version: "stereo-large",
              }
            }
          );
          const music = await Music.create({
            prompt:prompt,
            music:output,
            creatorId: user?._id
          })
          res.status(201).json({
            success: true,
            output:music.music,
          })
        
    } catch (error: any) {
        next(createError(500, error));
    }
} 

export const getAllMusic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.user?._id;
    const user = await User.findById(id);

    if(!user){
        throw createError(404, "User not found");
    }
    const audios = await Music.find().sort({createdAt:-1});
    if(!audios){
      throw createError(404, "You not have any audio files");
    }
    const musicArray:any = [];
    audios && audios.map((audio:any) => (
      audio.creatorId === user?._id.toString() && musicArray.push(audio)
        ))
    res.status(201).json({
      success: true,
      audios: musicArray
    })
  } catch (error: any) {
      next(createError(500, error));
  }
}
