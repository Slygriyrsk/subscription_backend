import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers/* (req, res) => {
    res.send({
        title: "GET all Users"
    })
} */)

//now here before moving to next that is getUSer we need a middleware to check if the user ID is valid or not
//by passing a middleware function to the route
//now we first need to sign-in to get the token and then use that token to access the user details
userRouter.get("/:id", authorize, getUser/* (req, res) => {
    res.send({
        title: "GET User Details"
    })
} */)

userRouter.post("/", (req, res) => {
    res.send({
        title: "CREATE New User"
    })
})

userRouter.put("/:id", (req, res) => {
    res.send({
        title: "UPDATE User Details"
    })
})

userRouter.delete("/:id", (req, res) => {
    res.send({
        title: "DELETE User"
    })
})

export default userRouter