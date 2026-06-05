import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    overview: {
        type: String
    },
    videoUrl: {
        type: String
    },
    videoPublicId: {
        type: String
    },
    duration: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    resources: [{
        title: String,
        url: String 
    }]
}, {timestamps: true})

export default mongoose.model("Lesson", lessonSchema)
