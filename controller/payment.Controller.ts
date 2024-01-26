import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Stripe from "stripe";
import { frontendUrl,  stripeSecretKey, stripeWebhooks } from "../secret/secret";
import { User } from "../model/user.Model";
import { Subscription } from "../model/subscription.Model";

export const stripe = new Stripe(stripeSecretKey,{
    apiVersion:"2023-10-16",
    typescript: true
});
const DAY_IN_MS = 86_400_000;

export const stripeCheckout = async (req:Request, res: Response, next: NextFunction ) => {

    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "user not fount");
        }
        const userSubscription = await Subscription.findOne({
            userId:user?._id
        })
        if(userSubscription && userSubscription.stripeCustomerId){
    
         const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: `${frontendUrl}/settings`
         })

         return res.status(201).json({
            success: true,
            url: stripeSession.url
         })
        }
       const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${frontendUrl}/settings`,
        cancel_url: `${frontendUrl}/settings`,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user?.email,
        line_items:[
            {
                price_data:{
                    currency:"USD",
                    product_data: {
                        name: "AI Studio Pro",
                        description: "Unlimited Ai Generation",
                    },
                    unit_amount: 2000,
                    recurring:{
                        interval: "month"
                    }
                },
                quantity:1,
            }
        ],
        metadata:{
             id
        }
       })
        return res.status(201).json({
            success: true,
            url: stripeSession.url
        })
    } catch (error: any) {
        next(createError(500, error));
    }
}

export const stripeWebhook = async (req:Request, res: Response, next: NextFunction ) => {
    const signature = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;       
       try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            stripeWebhooks
       )
       } catch (error:any) {
        console.log("Webhook error", error);
            next(createError(500, error));
            return;
       }

    const session = event.data.object as Stripe.Checkout.Session;
     if(event.type === "checkout.session.completed"){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );
        if(!session?.metadata?.id){
            throw createError(400, "User Id is required");
        }
         
        await Subscription.create({
            userId: session?.metadata?.id,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        })
     }
        if(event.type === "invoice.payment_succeeded"){
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
            );
            await Subscription.findOneAndUpdate({stripeSubscriptionId: subscription.id},{
                stripePriceId: subscription.items.data[0].id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
            })
        }
        res.status(200).json(null);

}

export const checkSubscription = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if(!user){
            throw createError(404, "user not fount");
        }
        const userSubscription = await Subscription.findOne({
            userId: user?._id
        })
        if(!userSubscription){
            throw createError(404, "user is not subscribed!");
        }
        const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();
    
        res.status(201).json({
            success: true,
            isValid
        })
    } catch (error: any) {
        next(createError(500, error));
    }
}

export const getSubscriber = async (req: Request, res: Response, next: NextFunction) => {
   try {
    const subscribers = await Subscription.find({});

    if(!subscribers){
        throw createError(404, "No subscribers found");
    }
    res.status(201).json({
        success: true,
        subscribers
    })
   } catch (error:any) {
      next(createError(500, error));
   }
}