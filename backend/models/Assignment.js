import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
