import mongoose,{Model, Document, Schema} from "mongoose";
interface IMessage extends Document{
    userId: string;
    messages: Array<{role: string, content: string, timeStamps:Date}>;
}
const messageSchema:Schema<IMessage> = new mongoose.Schema({
     userId:{
        type: String
     },
     messages:[
        {
            role: String,
            content: String,
            timeStamps: Date,
        }
     ]
},{
    timestamps: true
})

export const Messages:Model<IMessage> = mongoose.model("messages", messageSchema);