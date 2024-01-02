import { Response, Request, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import Replicate from "replicate";
import { replicateToken } from "../secret/secret";
import { Conversation } from "../model/conversation.Model";

const replicate = new Replicate({
    auth: replicateToken
})

export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
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
            "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
            {
              input: {
                debug: false,
                top_k: 50,
                top_p: 1,
                prompt: prompt,
                temperature: 0.5,
                system_prompt: "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
                max_new_tokens: 500,
                min_new_tokens: -1
              }
            }
          );
          const textString = output.join('');
          const conversation =  await Conversation.create({
            prompt: prompt,
            answer: textString,
            creatorId: user?._id
         });
          res.status(201).json({
            success: true,
            output: conversation.answer
         })   
        
    } catch (error: any) {
        console.log(error)
        next(createError(500, error));
    }
} 

export const getAllConversation = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "User not found");
        }
        const conversations = await Conversation.find().sort({createdAt: -1});
        const textArray:any = [];
    conversations && conversations.map((conversation:any) => (
      conversation.creatorId === user?._id.toString() && textArray.push(conversation)
        ))
    
        res.status(201).json({
            success: true,
            conversations: textArray
        })
    } catch (error: any) {
        next(createError(500, error));
    }
}
