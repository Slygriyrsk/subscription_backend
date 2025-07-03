import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
    res.send({
        title: "GET all Subscriptions"
    });
});

subscriptionRouter.get("/:id", (req, res) => {
    res.send({
        title: "GET Subscription Details"
    });

});

subscriptionRouter.post("/", (req, res) => {
    res.send({ 
        title: "CREATE New Subscription"
    });
});

subscriptionRouter.put("/:id", (req, res) => {
    res.send({
        title: "UPDATE Subscription Details"
    });
});

subscriptionRouter.delete("/:id", (req, res) => {
    res.send({
        title: "DELETE Subscription"
    });
});

subscriptionRouter.get("/user/:id", (req, res) => {
    res.send({
        title: "GET Subscriptions by User ID"
    });
});

subscriptionRouter.put("/:id/cancel", (req, res) => {
    res.send({
        title: "CANCEL Subscription"
    });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
    res.send({
        title: "GET Upcoming Renewals"
    });
});


export default subscriptionRouter;