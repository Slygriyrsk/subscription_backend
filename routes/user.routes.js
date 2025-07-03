import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
    res.send({
        title: "GET all Users"
    })
})

userRouter.get("/:id", (req, res) => {
    res.send({
        title: "GET User Details"
    })
})

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