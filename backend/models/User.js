import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["admin", "manager", "employee"],
            default: "employee"
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        assignments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment"
        }],
        onboardingStatus: {
            type: String,
            enum: ["not started", "in progress", "completed"],
            default: "not started"
        },
        tracking: {
            type: String
        },
        modules: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module"
        }],
        action: {
            type: String
        },
        badges: [
            {
                badge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Badge"
        },
        timeEarned: {
            type: Date,
            default: Date.now
        } //The time the badge is earned
                }],
        isActive: {
            type: Boolean,
            default: true
        },

},
{ 
    timestamps: true 
});


export default mongoose.model('User', userSchema);
