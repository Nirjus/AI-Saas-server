import mongoose,{Document, Schema, Model} from "mongoose";

export interface IImage extends Document{
    prompt: string;
    image: Array<{url:string,public_id:string}>;
    creatorId: string;
}

const imageSchema:Schema<IImage> = new mongoose.Schema({
    prompt:{
        type: String,
        required:[true, "Prompt is required"],
        minlength: [6, "Prompt should be 6 character long"]
    },
    creatorId:{
        type: String
    },
    image:[
        {
           public_id:{
            type: String,
           },
           url:{
            type: String,
           }
        }
    ]
},{
    timestamps:true
})

export const Image:Model<IImage> = mongoose.model("images", imageSchema);
