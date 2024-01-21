import { Document, Model} from "mongoose";
import { IMusic } from "../model/music.Model";
import { IVideo } from "../model/video.model";
import { IImage } from "../model/image.Model";
import { IConversation } from "../model/conversation.Model";
import { ICode } from "../model/code.Mode";
import { IUser } from "../model/user.Model";

interface MonthData{
    month: string,
    count: number,
}

export async function generateLast12monthData(
    model: Model<IUser>

): Promise<{last12Months: MonthData[]}>{
    const last12Months: MonthData[] = [];
    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() + 1);
    for(let i=11; i>=0; i--){
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i*28);
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);

        const monthYear = endDate.toLocaleString('default', {month:"short",year:"2-digit"});
        const count = await model.countDocuments({
            createdAt:{
                $gte: startDate,
                $lt: endDate,
            }
        });
        last12Months.push({month: monthYear, count});
    }
    return {last12Months}
}
interface MonthUserData {
    month: string;
    musicGeneration: number;
    videoGeneration: number;
    imageGeneration: number;
    codeGeneration: number;
    chatGeneration: number;
  }
export async function generateLast12MonthsGenerationData(
    musicModel: Model<IMusic>,
    videoModel: Model<IVideo>,
    imageModel: Model<IImage>,
    chatModel: Model<IConversation>,
    codeModel: Model<ICode>,
    // Add parameters for Image, Code, and Chat models
    userId: string
  ): Promise<{ last12MonthsUserData: MonthUserData[] }> {
    const last12MonthsUserData: MonthUserData[] = [];
    const currentDate = new Date();
  
    currentDate.setDate(currentDate.getDate() + 1);
    for (let i = 11; i >= 0; i--) {
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);
  
      const monthYear = endDate.toLocaleString('default', { day: "numeric", month:"short", year: "2-digit" });
  
      const musicCount = await musicModel.countDocuments({ creatorId:userId, createdAt: { $gte: startDate, $lt: endDate } });
      const videoCount = await videoModel.countDocuments({ creatorId:userId, createdAt: { $gte: startDate, $lt: endDate } });
      const imageCount = await imageModel.countDocuments({ creatorId:userId, createdAt: { $gte: startDate, $lt: endDate } });
      const codeCount = await codeModel.countDocuments({ creatorId:userId, createdAt: { $gte: startDate, $lt: endDate } });
      const chatCount = await chatModel.countDocuments({ creatorId:userId, createdAt: { $gte: startDate, $lt: endDate } });
      // Similar counts for Image, Code, and Chat models
  
      const monthData: MonthUserData = {
        month: monthYear,
        musicGeneration: musicCount,
        videoGeneration: videoCount,
        // Add counts for Image, Code, and Chat
        imageGeneration: imageCount, // Replace with actual count
        codeGeneration: codeCount, // Replace with actual count
        chatGeneration: chatCount, // Replace with actual count
      };
  
      last12MonthsUserData.push(monthData);
    }
  
    return { last12MonthsUserData };
  }
