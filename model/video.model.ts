import mongoose,{Document, Schema, Model} from "mongoose";

export interface IVideo extends Document{
    prompt: string;
    video:{
        public_id: string,
        url: string,
    };
    creatorId: string;
}

const videoSchema:Schema<IVideo> = new mongoose.Schema({
    prompt:{
        type: String,
        required:[true, "Prompt is required"],
        minlength: [6, "Prompt should be 6 character long"]
    },
    video:{
        public_id:{
            type: String,
        },
        url:{
            type: String
        }
    },
    creatorId:{
        type: String
    }
},{
    timestamps:true
})

export const Video:Model<IVideo> = mongoose.model("videos", videoSchema);
