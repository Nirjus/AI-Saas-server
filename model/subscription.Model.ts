import mongoose,{Document, Schema, Model} from "mongoose";

interface ISubscription extends Document{
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd: Date;
}

const subscriptionSchema:Schema<ISubscription> = new mongoose.Schema({
    userId:{
        type: String,
        unique: true,
        required:[true,"userId is required field"],
    },
    stripeCustomerId:{
        type: String,
        unique: true
    },
    stripeSubscriptionId:{
        type: String,
        unique: true,
    },
    stripePriceId:{
        type: String,
        unique: true,
    },
    stripeCurrentPeriodEnd:{
        type: Date
    }
},{timestamps: true})

export const Subscription:Model<ISubscription> = mongoose.model("subscriptions", subscriptionSchema);
