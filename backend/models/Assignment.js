import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ["assigned", "in_progress", "completed"]
    }
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
