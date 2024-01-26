import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { User } from "../model/user.Model";
import { Messages } from "../model/message.Model";

export const messageCreation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id, role, content} = req.body;
         const user = await User.findById(id);
         if(!user){
            throw createError(404, "user not found");
         }
        let message = await Messages.findOne({
            userId: user?._id
        });

        if(message){
           message.messages.push({
            role: role,
            content: content,
            timeStamps: new Date()
           })
           message.save();
        }else{
        message = await Messages.create({
            userId: user?._id,
            messages: [
                {
                    role: role,
                    content: content,
                    timeStamps: new Date()
                }
            ]
        })
        }

        res.status(201).json({
            success: true,
            message
        })
    } catch (error: any) {
        next(createError(500, error));
    }
}

export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);
        if(!user){
            throw createError(404, "user not found");
        }
        const messages = await Messages.findOne({
            userId: user?._id
        })

        if(!messages){
            throw createError(404, "messages not found");
        }

        res.status(201).json({
            success: true,
            messages: messages.messages
        })
    } catch (error: any) {
        next(createError(500, error));
    }
}