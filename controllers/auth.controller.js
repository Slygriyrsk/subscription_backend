//the main idea here to define this controler so that we can use it in the routes
//not writing the code in the routes directly to aboid complexity and code readability issues

import mongoose from "mongoose";
import User from "../models/user.model.js"; // Import the User model
import { JWT_EXPIRY, JWT_SECRET } from "../config/env.js";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation

export const signUp = async (req, res, next) => {
    //This is Atomic operation which states either completely full or nothing changes at all
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //now we will create a new user
        // and the error here occurs is NOTE: Cannot destructure property 'name' of 'req.body' as it is undefined. 
        // because it is and we need to enable the parse middleware in app.js  so that it can parse all JSON req and make the data avail as req.body
        const { name, email, password } = req.body; //this will get the data from the client
        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }

        //check if the user already exists
        //either use any one of the codes
        //const existingUser = await mongoose.model('User').findOne({ email }).session(session);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 400; // Bad Request
            throw error;
        }

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //now create a new user and pass as an array to create multiple users at once
        //but here we will create only one user
        //we will use the session to make it atomic operation and if something goes wrong and it doesnot create the user
        // it will rollback the transaction and abort the transaction otherwise commit the transaction
        const newUser = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session });

        //now the user will use token for sign in and sign up and have to pass 3 parameters
        const token = jwt.sign (
            { userId: newUser[0]._id }, // Use the first user in the array
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY } 
        )

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        //now everything is fine and we will send the response back to the client
        res.status(201).json({
            success: true,
            message: "User created successfully",
            //password: hashedPassword, // For demonstration purposes, 
            // you might not want to send the password back because its is there in the db itself
            data: {
                token, // Send the token back to the client
                user: newUser[0] // Send the first user in the array
            },
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error); // Pass the error to the global error handler
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        //get user by email
        const user = await User.findOne({ email });
        //const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // Generate a token
        const token = jwt.sign(
            { userId: user._id }, // this time we didnot destructure the first element of the array as we are getting only one user
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        // Send the token and user data back to the client
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token, // Send the token back to the client
                user // Send the user data back to the client
            },
        });
    } catch (error) {
        /* await session.abortTransaction();
        session.endSession(); */
        next(error); // Pass the error to the global error handler
    }
}

export const signOut = (req, res, next) => {
    try {

    } catch (error) {
        next(error); // Pass the error to the global error handler
    }
}