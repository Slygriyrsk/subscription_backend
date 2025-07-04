import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js"; // Import the JWT secret from environment variables
import User from "../models/user.model.js"; // Import the User model

//someone is making a request to get user details -> auth middleware -> verify -> if valid -> next -> user details

export const authorize = async (req, res, next) => {
    try {
        //check matching the token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Extract the token from the Authorization header
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access, token not provided"
            });
        }

        //verify the token, add this into authorization/bearer token in the postman and then in GET route users/_id for the user to get the user info
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password"); // Fetch the user from the database, excluding the password field
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized access, user not found" });
        }

        req.user = user; // Attach the user object to the request for use in subsequent middleware or route handlers
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized access",
            error: error.message
        });
        next(error); // Pass the error to the global error handler
    }
}