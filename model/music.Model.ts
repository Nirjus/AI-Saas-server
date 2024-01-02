import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMusic extends Document{
    prompt: string;
    music: string;
    creatorId: string;
}

const musicSchema:Schema<IMusic> = new mongoose.Schema({
     prompt:{
        type: String,
        required:[true, "Prompt is required"],
        minlength:[3, "Minimum 3 character is required"]
     },
     music:{
        type: String,
     },
     creatorId:{
        type: String,
     }
},{
    timestamps: true
})

export const Music:Model<IMusic> = mongoose.model("music", musicSchema);

