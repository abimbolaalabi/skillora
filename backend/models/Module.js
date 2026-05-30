import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.model('Module', moduleSchema);
