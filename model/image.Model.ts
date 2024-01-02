import mongoose,{Document, Schema, Model} from "mongoose";

export interface IImage extends Document{
    prompt: string;
    image: Array<{imageUrl:string}>;
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
            imageUrl: String,
        }
    ]
},{
    timestamps:true
})

export const Image:Model<IImage> = mongoose.model("images", imageSchema);
