import { SERVER_URL } from "../config/env.js";
import { WorkflowClient } from "../config/upstash.js";
import subscriptionModel from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionModel.create({
            ...req.body, //send over the entire body here
            user: req.user._id,//need to get the user with the unique id to know about the subscription details
        });

        // Trigger the workflow for subscription reminder
        const { workflowRunId } = await WorkflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        return res.status(201).json({ success: true, data: { subscription, workflowRunId} });
    } catch (error) {
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const allsubscriptions = await subscriptionModel.find().populate("user", "email");
        return res.status(201).json({  success: true, data: allsubscriptions });
    } catch (error) {
        next(error);
    }
}

export const createUserSubscription = async (req, res, next) => {
    try {
        //check if the user is same as the one in token
        if(req.user.id !== req.params.id) {
            const error = new Error("You are not the owner of this subscription account");
            error.status = 401;
            throw error;
        }
        
        //find must be used for GET req
        const subscriptions = await subscriptionModel.find({ user: req.params.id });
        return res.status(201).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}

export const getSubscriptionByID = async (req, res, next) => {
    try {
        //get the subs id from the monogdb to check the working of the api routes
        const subscription = await subscriptionModel.findById(req.params.id);
        if(!subscription) {
            return res.status(404).json({ error: "Subscription not found" });
        }
        return res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        //get the subscription id
        const subscription = await subscriptionModel.findById(req.params.id);
        if(!subscription) {
            return res.status(404).json({ error: "Subscription not found" });
        }
        //authorize is already added in the route but demo
        if (String(subscription.user) !== String(req.user._id)) {
            return res.status(403).json({ error: "Unauthorized to update this subscription" });
        }

        //we are taking properties/cahnges from req.body and copying the changes into the subcription
        Object.assign(subscription, req.body);
        await subscription.save();

        return res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionModel.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ error: "Subscription not found" });
        }

        if (String(subscription.user) !== String(req.user._id)) {
            return res.status(403).json({ error: "Unauthorized to delete this subscription" });
        }

        await subscription.deleteOne();
        return res.status(201).json({ success: true, message: "Subscription deleted Successfully" })
    } catch (error) {
        next(error);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        //we donot use req.body here bcoz we don't know which subscription to cancel out of all
        const subscription = await subscriptionModel.findById(req.params.id);
        if(!subscription) return res.status(404).json({ error: "Subscription not found" });

        if(String(subscription.user) !== String(req.user._id)) {
            return res.status(403).json({ error: "Unauthorized to delete this subscription" });
        }

        subscription.status = "cancelled";//change the status to cancel and then save it
        await subscription.save();

        return res.status(201).json({ success: true, message: `Subscription with ${req.params.id} cancelled successfully.`, data: subscription })
    } catch (error) {
        next(error);
    }
}

export const renewalSubscription = async (req, res, next) => {
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7); // Show upcoming in next 7 days

        const subscription = await subscriptionModel.find({
            user: req.user._id,
            renewalDate: { $gte: today, $lte: nextWeek },
            status: "active"
        });

        return res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}