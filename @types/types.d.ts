import { IUser } from "../model/user.Model";
import { Request } from "express";

declare global {
    namespace Express {
        interface Request{
            user?: IUser
        }
    }   
}