const errorMiddleware = (err, req, res, next) => {
    //we are using this middleware to handle errors globally, instead of typing try catch block everywhere
    //we have a centralized error handler here
    try {
        let error = { ...err };
        console.error(err); // Log the error for debugging steps

        //these errors are very common in mongoose so by default add it there
        // Mongoose bad ObjectId error
        if (err.name === "CastError") {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message);
            error.statusCode = 404; // Not Found
        }

        //Moongoose duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate field value entered: ${err.keyValue.name}`;
            error = new Error(message);
            error.statusCode = 400; // Bad Request
        }

        //Moongoose validation error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(val => val.message).join(", ");
            error = new Error(message);
            error.statusCode = 400; // Bad Request
        }

    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
};

export default errorMiddleware;