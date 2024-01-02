import mongoose,{Model, Schema, Document} from "mongoose";

export interface ICode extends Document{
    prompt: string;
    solution: string;
    creatorId: string;
}

const codeSchema:Schema<ICode> = new mongoose.Schema({
   prompt:{
    type: String,
    required:[true, "Prompt is required"],
    minlength:[4, "minmum character should be 4"]
   },
   solution:{
    type: String
   },
   creatorId:{
    type: String
   }
},{timestamps:true})

export const Code:Model<ICode> = mongoose.model("codes", codeSchema);
