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
    role: {
        type: String,
        enum: ["admin", "manager", "employee"]
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dueDate: {
        type: Date
    },
    overdue: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["not started", "in progress", "completed"],
        default: "not started"
    }
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
