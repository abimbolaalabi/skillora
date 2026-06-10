import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true
    },
    completionDate: {
        type: Date,
        default: Date.now
    },
    certificateNumber: {
        type: String,
        required: true,
        unique: true
    },
    criteria: {
        type: String,
        required: true,
        trim: true
    },
    certificateUrl: {
        type: String,
        required: true,

    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

export default mongoose.model("Certificate", certificateSchema);