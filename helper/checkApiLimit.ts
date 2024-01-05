import createError from "http-errors";
import { User } from "../model/user.Model";
import { maxFreeCredit } from "../secret/secret";

export const checkAPIlimit = async (user:any, id:string)=> {

    try {
        if(user?.credit){
            if(user?.credit < maxFreeCredit){
            await User.findByIdAndUpdate(id,{
                credit: user?.credit + 1
            })
            return true;
            }else{
              return false;
            }
          }else{
            await User.findByIdAndUpdate(id,{
                credit: 1
            })
            return true;
          }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}