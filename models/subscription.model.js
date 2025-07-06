import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: [3, "Subscription name must be at least 3 characters long"],
        maxLength: [50, "Subscription name must be at most 50 characters long"],
    },
    price : {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Price cannot be negative"],
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        trim: true,
        uppercase: true,
        enum: ["USD", "EUR", "GBP", "INR", "AUD", "CAD"], // Add more currencies as needed
        default: "INR",
    },
    frequency: {
        type: String,
        required: [true, "Billing frequency is required"],
        trim: true,
        enum: ["daily", "weekly", "monthly", "yearly"], // Add more frequencies as needed
        default: "monthly",
    },
    category: {
        type: String,
        required: [true, "Subscription category is required"],
        trim: true,
        enum: ["sports", "news" , "entertainment", "technology", "utilities", "food", "health", "education", "other"], // Add more categories as needed
        default: "other",
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        trim: true,
        enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "other"], // Add more payment methods as needed
        default: "credit_card",
    },
    status: {
        type: String,
        required: [true, "Subscription status is required"],
        trim: true,
        enum: ["active", "cancelled", "expired", "pending"], // Add more statuses as needed
        default: "active",
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        default: Date.now, // Default to current date if not provided
        validate: {
            validator: (val) => val <= Date.now(),
            message: "Start date cannot be in the future"
        }
    },
    renewalDate: {
        type: Date,
        //required: [true, "Renewal date is required"], we don't need to give this because we can pass a function checking for that renewal date based on the start date
        validate: {
            validator: function (val) {
                return val == null || val > this.startDate; //ensure renewal date is after start date
            },
            message: "Renewal date cannot be in the past"
        }
    },
    //we need to get the userId as well so that we can know which user has which subscription
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: [true, "User ID is required"],
        index: true // Index for faster lookups
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

/* subscriptionSchema.pre('save', function (next) {
    // Automatically set renewalDate based on frequency
    if (!this.renewalDate) {
        const frequencyMap = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        const monthsToAdd = frequencyMap[this.frequency] || 1; // Default to 1 month if frequency is not recognized
        this.renewalDate = new Date(this.startDate);
        //this line will check for the month say Jan and decide how many days are there in this month that is 31
        this.renewalDate.setMonth(this.renewalDate.getMonth() + monthsToAdd);
    }

    if(this.renewalDate < new Date()) {
        this.status = "expired"; // Automatically set status to expired if renewal date is in the past
    }
    next();
}); */

subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const now = new Date(this.startDate);
        const frequency = this.frequency;

        switch (frequency) {
            case 'daily':
                now.setDate(now.getDate() + 1);
                break;
            case 'weekly':
                now.setDate(now.getDate() + 7);
                break;
            case 'monthly':
                now.setMonth(now.getMonth() + 1);
                break;
            case 'yearly':
                now.setFullYear(now.getFullYear() + 1);
                break;
            default:
                now.setMonth(now.getMonth() + 1);
        }

        this.renewalDate = now;
    }

    // Optional: expire subscriptions that are already outdated
    if (this.renewalDate < new Date()) {
        this.status = "expired";
    }

    next();
});

const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);
export default subscriptionModel;