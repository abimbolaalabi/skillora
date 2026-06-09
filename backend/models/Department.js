import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    assignedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

}, {timestamps: true})

export default mongoose.model("Department", departmentSchema);