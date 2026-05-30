import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
