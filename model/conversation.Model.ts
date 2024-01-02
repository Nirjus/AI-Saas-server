import mongoose, { Document, Schema, Model } from "mongoose";

export interface IConversation extends Document{
    prompt: string;
    answer: string;
    creatorId: string;
}

const conversationSchema:Schema<IConversation> = new mongoose.Schema({
     prompt:{
        type: String,
        required:[true, "Prompt is required"],
        minlength:[3, "Minimum 3 character is required"]
     },
     answer:{
        type: String
     },
     creatorId:{
        type: String
     }
},{
    timestamps: true
})

export const Conversation:Model<IConversation> = mongoose.model("conversations", conversationSchema);

