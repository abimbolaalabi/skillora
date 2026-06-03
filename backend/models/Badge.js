import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.model('Badge', badgeSchema);
