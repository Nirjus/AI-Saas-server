import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import Replicate from "replicate";
import { replicateToken } from "../secret/secret";
import { Image } from "../model/image.Model";


const replicate = new Replicate({
    auth: replicateToken
})

interface IImageGeneration{
    prompt: string;
    num: number;
}

export const imageGeneration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "User not found");
        }
        const {prompt, num} = req.body as IImageGeneration;
        if(!prompt){
            throw createError(404, "Prompt is required");
        }
        if(!num){
            throw createError(404, "Select Number of Image you want to generate");
        }
        const output:any = await replicate.run(
            "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
            {
              input: {
                prompt: prompt,
                num_outputs: num
              }
            }
          );
          console.log(output);
         
          const picture = await Image.create({
            prompt: prompt,
            creatorId: user?._id
          })
          output.map((format:any) => {
            picture.image.push({
                imageUrl: format
              })
          })
          await picture.save();
            
        res.status(201).json({
            success: true,
             output: picture.image
        })
    } catch (error: any) {
        next(createError(500, error))
    }
}
export const getAllImage = async (req:Request, res: Response, next: NextFunction) => {

    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "User not found");
        }
        const images = await Image.find().sort({createdAt: -1});
       if(!images){
        throw createError(404, "No Image found");
       }
       const imgArray:any = [];
        images && images.map((image:any) => (
            image.creatorId === user?._id.toString() && imgArray.push(image)
        ))
        res.status(201).json({
            success: true,
            images: imgArray
        })
    } catch (error: any) {
        next(createError(500, error));
    }
}
