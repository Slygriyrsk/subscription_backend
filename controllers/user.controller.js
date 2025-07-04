import User from "../models/user.model.js";
import mongoose from "mongoose";

//to get all the users
export const getUsers = async (req, res, next) => {
    try {
        const user = await User.find();

        res.status(200).json({
            success: true,
            message: "All Users fetched successfully",
            data: user
        });
    } catch (error) {
        next(error); // Pass the error to the global error handler
    }
}

//to get a particular user
export const getUser = async (req, res, next) => {
    try {
        //got err about invalid user ID format, so we will check if the user ID is valid or not
        if(mongoose.Types.ObjectId.isValid(req.params.id) === false) {
            const error = new Error("Invalid user ID format");
            error.status = 400;
            throw error;
        }

        //to get the user copy the _id field and pass it to GET req in postman
        const user = await User.findById(req.params.id).select("-password"); // Exclude password from the response and select everything of that user

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "All Users fetched successfully",
            data: user
        });
    } catch (error) {
        next(error); // Pass the error to the global error handler
    }
}