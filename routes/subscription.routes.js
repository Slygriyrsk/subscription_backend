import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { cancelSubscription, createSubscription, createUserSubscription, deleteSubscription, getAllSubscriptions, getSubscriptionByID, renewalSubscription, updateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", getAllSubscriptions/* (req, res) => {
    res.send({
        title: "GET all Subscriptions"
    });
} */);

//moved here because this is a custom route, so must be defined before dynamic routes otherwise it will not be a valid Object causing err
subscriptionRouter.get("/upcoming-renewals", authorize, renewalSubscription /* (req, res) => {
    res.send({
        title: "GET Upcoming Renewals"
    });
} */);

subscriptionRouter.get("/:id", authorize, getSubscriptionByID /* (req, res) => {
    res.send({
        title: "GET Subscription Details"
    });

} */);

//authorize before creating a subscription and then used another middleware of creating a subscription rather than simply passing a text msg
subscriptionRouter.post("/", authorize, createSubscription/* (req, res) => {
    res.send({ 
        title: "CREATE New Subscription"
    });
} */);

subscriptionRouter.put("/:id", authorize, updateSubscription /* (req, res) => {
    res.send({
        title: "UPDATE Subscription Details"
    });
} */);

subscriptionRouter.delete("/:id", authorize, deleteSubscription/* (req, res) => {
    res.send({
        title: "DELETE Subscription"
    });
} */);

//authorize user as well while getting the info
subscriptionRouter.get("/user/:id", authorize, createUserSubscription/* (req, res) => {
    res.send({
        title: "GET Subscriptions by User ID"
    });
} */);

subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription/* (req, res) => {
    res.send({
        title: "CANCEL Subscription"
    });
} */);

export default subscriptionRouter;