import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        //we passed an arr here to ensure that username is written otherwise we will know why err happens
        required: [true, "Username is required"],
        trim: true,
        minLenght: [3, "Username must be at least 3 characters long"],
        maxLenght: [30, "Username must be at most 20 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        check: {
            checker: function (v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLenght: [6, "Password must be at least 6 characters long"],
            maxLenght: [20, "Password must be at most 20 characters long"],
        }
    }
}, { timestamps: true }); //so we know when the user was created or updated

const User = mongoose.model("User", userSchema);
export default User;