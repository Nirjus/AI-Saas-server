import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMusic extends Document{
    prompt: string;
    music: string;
    output_format: string;
    duration: number;
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
     output_format:{
      type: String
     },
     duration:{
      type: Number
     },
     creatorId:{
        type: String,
     }
},{
    timestamps: true
})

export const Music:Model<IMusic> = mongoose.model("music", musicSchema);

