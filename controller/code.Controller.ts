import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import Replicate from "replicate";
import { replicateToken } from "../secret/secret";
import { Code } from "../model/code.Mode";
import { checkAPIlimit } from "../helper/checkApiLimit";
import { Subscription } from "../model/subscription.Model";

const replicate = new Replicate({
    auth: replicateToken
})
const DAY_IN_MS = 86_400_000;

export const createCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user = await User.findById(id);
        if(!user) {
            throw createError(404, "User not found");
        }
        const {prompt} = req.body;
        const userSubscription = await Subscription.findOne({
          userId: user?._id
      })
      const isValid = userSubscription?.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
    
        const freeTrail = await checkAPIlimit(user,id); 
       
        if(!freeTrail && !isValid){
          throw createError(404, "You reached the free tier limit!");
        }
        const output:any = await replicate.run(
            "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
            {
              input: {
                debug: false,
                top_k: 50,
                top_p: 1,
                prompt: prompt,
                temperature: 0.5,
                system_prompt: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations",
                max_new_tokens: 500,
                min_new_tokens: -1
              }
            }
          );
          const textString = output.join('');
          const code = await Code.create({
            prompt: prompt,
            solution: textString,
            creatorId: user?._id
          })
          res.status(201).json({
            success: true,
            output: code.solution
          })

    } catch (error: any) {
        next(createError(500, error));
    }
}

export const getAllcodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user = await User.findById(id);
        if(!user) {
            throw createError(404, "User not found");
        }
     const codes = await Code.find({
       creatorId: user?._id
     }).sort({createdAt: -1});
    

     res.status(201).json({
        success: true,
        codesArray: codes
     })
    } catch (error: any) {
        next(createError(500, error));
    }
}