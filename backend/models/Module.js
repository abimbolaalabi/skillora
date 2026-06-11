import mongoose from "mongoose";


const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    }],
    totalLessons: {
        type: Number,
        default: 0
    },
     reflectionQuestion: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0
        
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    }
}, { timestamps: true });

export default mongoose.model('Module', moduleSchema);
