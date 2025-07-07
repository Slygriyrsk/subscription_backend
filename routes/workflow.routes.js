import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders /* (req, res) => { return res.status(201).json({ sucess: true, message: "Workflow Router working" }) } */);

export default workflowRouter;