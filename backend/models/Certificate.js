import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: [true, "Certificate title is required"],
        trim: true,
    },  


    description: {
        type: String,
        required: [true, "Certificate description is required"],
        trim: true,
    },

    issuedTo: {
        type: String,
        required: [true, "Recipient is required"],
        trim: true,
    },

    issuedBy: {
        type: String,
        required: [true, "Issuer is required"],
        trim: true,
    },
    certificateNumber: {
        type: String,
        unique: true,
        required: true,        
    },
    certificateUrl: {
        type: String,
        required: [true, "Certificate file is required"],
    },

    type: {
        type: String,
        enum: ["course", "achievement", "completion"],
        default: "completion",
    },
    dateIssued: {
        type: Date,
        default: Date.now,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
},
{
    timestamps: true,
}


);

export default mongoose.model("Certificate", certificateSchema);
