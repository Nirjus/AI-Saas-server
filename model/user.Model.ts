import mongoose, { Schema, Document, Model } from "mongoose";
const emailRegexp: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
import bcryptjs from "bcryptjs";

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    address: string;
    phoneNumber?: number;
    credit?: number;
    role: string;
    avatar:{
        url:string;
        public_id: string;
    },
    socialAvatar?: string; 
}

const userSchema:Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
        trim: true,
        maxlength: [30, "Excide the name character limit, maximum length 30"],
        minlength: [3, "name must contain atlist 3 character"],
    },
    email:{
        type: String,
        trim: true,
        required: [true, "Email is required"],
        validate: {
            validator: function (v:string){
                return emailRegexp.test(v);
            }, 
            message: "Email must contain the valid expression",
        },
        unique: true,
    },
    password:{
        type: String,
        minlength:[6, "minmum length is 6"],
        set: (v:string) => bcryptjs.hashSync(v, bcryptjs.genSaltSync(10)),
    },
    address:{
        type: String,
    },
    phoneNumber:{
        type: Number,
    },
    role:{
        type: String,
        default: "user"
    },
    avatar:{
        public_id:{
            type: String,
        },
        url:{
            type: String,
        }
    },
    socialAvatar:{
        type: String,
    },
    credit:{
        type: Number,
        default: 0,
    }
},{timestamps: true})

export const User: Model<IUser> = mongoose.model("users", userSchema);